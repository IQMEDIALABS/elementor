<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class DB {

	/**
	 * Current DB version of the editor.
	 */
	const DB_VERSION = '0.4';

	const STATUS_PUBLISH = 'publish';
	const STATUS_PRIVATE = 'private';
	const STATUS_DRAFT = 'draft';
	const STATUS_AUTOSAVE = 'autosave';

	/**
	 * @var array
	 */
	protected $switched_post_data = [];

	/**
	 * Save builder method.
	 *
	 * @access public
	 * @since 1.0.0
	 *
	 * @param int $post_id
	 * @param array $posted
	 * @param string $status
	 *
	 * @return void
	 */
	public function save_editor( $post_id, $posted, $status = self::STATUS_PUBLISH ) {
		// Change the global post to current library post, so widgets can use `get_the_ID` and other post data
		$this->switch_to_post( $post_id );

		$editor_data = $this->_get_editor_data( $posted );

		// We need the `wp_slash` in order to avoid the unslashing during the `update_post_meta`
		$json_value = wp_slash( wp_json_encode( $editor_data ) );

		$old_autosave = wp_get_post_autosave( $post_id, get_current_user_id() );

		if ( $old_autosave ) {
			wp_delete_post_revision( $old_autosave->ID );
		}

		$save_original = true;

		// If the post is a draft - save the `autosave` to the original draft.
		// Allow a revision only if the original post is already published.
		if ( self::STATUS_AUTOSAVE === $status && in_array( get_post_status( $post_id ), [ self::STATUS_PUBLISH, self::STATUS_PRIVATE ], true ) ) {
			$save_original = false;
		}

		if ( $save_original ) {
			// Don't use `update_post_meta` that can't handle `revision` post type
			$is_meta_updated = update_metadata( 'post', $post_id, '_elementor_data', $json_value );

			/**
			 * Fires before Elementor saves data to the database.
			 *
			 * @since 1.0.0
			 *
			 * @param string   $status          Post status.
			 * @param int|bool $is_meta_updated Meta ID if the key didn't exist, true on successful update, false on failure.
			 */
			do_action( 'elementor/db/before_save', $status, $is_meta_updated );

			$this->save_plain_text( $post_id );
		} else {
			/**
			 * Fires before Elementor saves data to the database.
			 *
			 * @since 1.0.0
			 *
			 * @param string   $status          Post status.
			 * @param int|bool $is_meta_updated Meta ID if the key didn't exist, true on successful update, false on failure.
			 */
			do_action( 'elementor/db/before_save', $status, true );

			$autosave_id = wp_create_post_autosave( [
				'post_ID' => $post_id,
				'post_title' => __( 'Auto Save', 'elementor' ) . ' ' . date( 'Y-m-d H:i' ),
				'post_modified' => current_time( 'mysql' ),
			] );

			if ( $autosave_id ) {
				update_metadata( 'post', $autosave_id, '_elementor_data', $json_value );
			}
		}

		update_post_meta( $post_id, '_elementor_version', self::DB_VERSION );

		// Restore global post
		$this->restore_current_post();

		// Remove Post CSS
		delete_post_meta( $post_id, Post_CSS_File::META_KEY );

		/**
		 * Fires after Elementor saves data to the database.
		 *
		 * @since 1.0.0
		 *
		 * @param int   $post_id     The ID of the post.
		 * @param array $editor_data Sanitize posted data.
		 */
		do_action( 'elementor/editor/after_save', $post_id, $editor_data );
	}

	/**
	 * Get & Parse the builder from DB.
	 *
	 * @access public
	 * @since 1.0.0
	 *
	 * @param int $post_id
	 * @param string $status
	 *
	 * @return array
	 */
	public function get_builder( $post_id, $status = self::STATUS_PUBLISH ) {
		$data = $this->get_plain_editor( $post_id, $status );

		$this->switch_to_post( $post_id );
		$editor_data = $this->_get_editor_data( $data, true );
		$this->restore_current_post();

		return $editor_data;
	}

	/**
	 * @since 1.0.0
	 * @access protected
	 *
	 * @param integer $post_id
	 * @param string $key
	 *
	 * @return array
	 */
	protected function _get_json_meta( $post_id, $key ) {
		$meta = get_post_meta( $post_id, $key, true );

		if ( is_string( $meta ) && ! empty( $meta ) ) {
			$meta = json_decode( $meta, true );
		}

		if ( empty( $meta ) ) {
			$meta = [];
		}

		return $meta;
	}

	/**
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int $post_id
	 * @param string $status
	 *
	 * @return array
	 */
	public function get_plain_editor( $post_id, $status = self::STATUS_PUBLISH ) {
		$data = $this->_get_json_meta( $post_id, '_elementor_data' );

		if ( self::STATUS_DRAFT === $status ) {
			$autosave = wp_get_post_autosave( $post_id );

			if ( is_object( $autosave ) ) {
				$data = $this->_get_json_meta( $autosave->ID, '_elementor_data' );
			}
		} elseif ( empty( $data ) ) {
			$data = $this->_get_new_editor_from_wp_editor( $post_id );
		}

		return $data;
	}

	/**
	 * @since 1.0.0
	 * @access protected
	*/
	protected function _get_new_editor_from_wp_editor( $post_id ) {
		$post = get_post( $post_id );

		if ( empty( $post ) || empty( $post->post_content ) ) {
			return [];
		}

		$text_editor_widget_type = Plugin::$instance->widgets_manager->get_widget_types( 'text-editor' );

		// TODO: Better coding to start template for editor
		return [
			[
				'id' => Utils::generate_random_string(),
				'elType' => 'section',
				'elements' => [
					[
						'id' => Utils::generate_random_string(),
						'elType' => 'column',
						'elements' => [
							[
								'id' => Utils::generate_random_string(),
								'elType' => $text_editor_widget_type::get_type(),
								'widgetType' => $text_editor_widget_type->get_name(),
								'settings' => [
									'editor' => $post->post_content,
								],
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Set whether the page is elementor page or not
	 *
	 * @access public
	 * @since 1.5.0
	 *
	 * @param int $post_id
	 * @param bool $is_elementor
	 */
	public function set_is_elementor_page( $post_id, $is_elementor = true ) {
		if ( $is_elementor ) {
			// Use the string `builder` and not a boolean for rollback compatibility
			update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
		} else {
			delete_post_meta( $post_id, '_elementor_edit_mode' );
		}
	}

	/**
	 * @since 1.0.0
	 * @access private
	*/
	private function _render_element_plain_content( $element_data ) {
		if ( 'widget' === $element_data['elType'] ) {
			/** @var Widget_Base $widget */
			$widget = Plugin::$instance->elements_manager->create_element_instance( $element_data );

			if ( $widget ) {
				$widget->render_plain_content();
			}
		}

		if ( ! empty( $element_data['elements'] ) ) {
			foreach ( $element_data['elements'] as $element ) {
				$this->_render_element_plain_content( $element );
			}
		}
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function save_plain_text( $post_id ) {
		ob_start();

		$data = $this->get_plain_editor( $post_id );

		if ( $data ) {
			foreach ( $data as $element_data ) {
				$this->_render_element_plain_content( $element_data );
			}
		}

		$plain_text = ob_get_clean();

		// Remove unnecessary tags.
		$plain_text = preg_replace( '/<\/?div[^>]*\>/i', '', $plain_text );
		$plain_text = preg_replace( '/<\/?span[^>]*\>/i', '', $plain_text );
		$plain_text = preg_replace( '#<script(.*?)>(.*?)</script>#is', '', $plain_text );
		$plain_text = preg_replace( '/<i [^>]*><\\/i[^>]*>/', '', $plain_text );
		$plain_text = preg_replace( '/ class=".*?"/', '', $plain_text );

		// Remove empty lines.
		$plain_text = preg_replace( '/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/', "\n", $plain_text );

		wp_update_post(
			[
				'ID' => $post_id,
				'post_content' => $plain_text,
			]
		);
	}

	/**
	 * Sanitize posted data.
	 *
	 * @access private
	 * @since 1.0.0
	 *
	 * @param array $data
	 *
	 * @param bool $with_html_content
	 *
	 * @return array
	 */
	private function _get_editor_data( $data, $with_html_content = false ) {
		$editor_data = [];

		foreach ( $data as $element_data ) {
			$element = Plugin::$instance->elements_manager->create_element_instance( $element_data );

			if ( ! $element ) {
				continue;
			}

			$editor_data[] = $element->get_raw_data( $with_html_content );
		} // End foreach().

		return $editor_data;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function iterate_data( $data_container, $callback ) {
		if ( isset( $data_container['elType'] ) ) {
			if ( ! empty( $data_container['elements'] ) ) {
				$data_container['elements'] = $this->iterate_data( $data_container['elements'], $callback );
			}

			return $callback( $data_container );
		}

		foreach ( $data_container as $element_key => $element_value ) {
			$element_data = $this->iterate_data( $data_container[ $element_key ], $callback );

			if ( null === $element_data ) {
				continue;
			}

			$data_container[ $element_key ] = $element_data;
		}

		return $data_container;
	}

	/**
	 * @since 1.1.0
	 * @access public
	*/
	public function copy_elementor_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );

		foreach ( $from_post_meta as $meta_key => $values ) {
			// Copy only meta with the `_elementor` prefix
			if ( 0 === strpos( $meta_key, '_elementor' ) ) {
				$value = $values[0];

				// The elementor JSON needs slashes before saving
				if ( '_elementor_data' === $meta_key ) {
					$value = wp_slash( $value );
				} else {
					$value = maybe_unserialize( $value );
				}

				// Don't use `update_post_meta` that can't handle `revision` post type
				update_metadata( 'post', $to_post_id, $meta_key, $value );
			}
		}
	}

	/**
	 * @since 1.0.10
	 * @access public
	*/
	public function is_built_with_elementor( $post_id ) {
		return ! ! get_post_meta( $post_id, '_elementor_edit_mode', true );
	}

	/**
	 * @access public
	 * @deprecated 1.4.0
	 */
	public function has_elementor_in_post( $post_id ) {
		return $this->is_built_with_elementor( $post_id );
	}

	/**
	 * @since 1.5.0
	 * @access public
	*/
	public function switch_to_post( $post_id ) {
		$post_id = absint( $post_id );
		// If is already switched, or is the same post, return.
		if ( get_the_ID() === $post_id ) {
			$this->switched_post_data[] = false;
			return;
		}

		$this->switched_post_data[] = [
			'switched_id' => $post_id,
			'original_id' => get_the_ID(), // Note, it can be false if the global isn't set
		];

		$GLOBALS['post'] = get_post( $post_id );
		setup_postdata( $GLOBALS['post'] );
	}

	/**
	 * @since 1.5.0
	 * @access public
	*/
	public function restore_current_post() {
		$data = array_pop( $this->switched_post_data );

		// If not switched, return.
		if ( ! $data ) {
			return;
		}

		// It was switched from an empty global post, restore this state and unset the global post
		if ( false === $data['original_id'] ) {
			unset( $GLOBALS['post'] );
			return;
		}

		$GLOBALS['post'] = get_post( $data['original_id'] );
		setup_postdata( $GLOBALS['post'] );
	}
}
