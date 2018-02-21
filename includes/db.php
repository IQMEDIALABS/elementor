<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor database class.
 *
 * Elementor database handler class is responsible for communicating with the
 * DB, save and retrieve Elementor data and meta data.
 *
 * @since 1.0.0
 */
class DB {

	/**
	 * Current DB version of the editor.
	 */
	const DB_VERSION = '0.4';

	/**
	 * Post publish status.
	 */
	const STATUS_PUBLISH = 'publish';

	/**
	 * Post draft status.
	 */
	const STATUS_DRAFT = 'draft';

	/**
	 * Post private status.
	 */
	const STATUS_PRIVATE = 'private';

	/**
	 * Post autosave status.
	 */
	const STATUS_AUTOSAVE = 'autosave';

	/**
	 * Post pending status.
	 */
	const STATUS_PENDING = 'pending';

	/**
	 * Switched post data.
	 *
	 * Holds the post data.
	 *
	 * @since 1.5.0
	 * @access protected
	 *
	 * @var array Post data. Default is an empty array.
	 */
	protected $switched_post_data = [];

	protected $switched_data = [];

	/**
	 * Save editor.
	 *
	 * Save data from the editor to the database.
	 *
	 * @since 1.0.0
	 * @deprecated 2.0.0
	 *
	 * @access public
	 *
	 * @param int    $post_id Post ID.
	 * @param array  $data    Post data.
	 * @param string $status  Optional. Post status. Default is `publish`.
	 *
	 * @return bool
	 */
	public function save_editor( $post_id, $data, $status = self::STATUS_PUBLISH ) {
		// TODO: _deprecated_function( __METHOD__, '2.0.0', '$document->save()' );

		$document = Plugin::$instance->documents->get( $post_id );

		if ( self::STATUS_AUTOSAVE === $status ) {
			$document = $document->get_autosave( 0, true );
		}

		return $document->save( [
			'elements' => $data,
		] );
	}

	/**
	 * Get builder.
	 *
	 * Retrieve editor data from the database.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int    $post_id Post ID.
	 * @param string $status  Optional. Post status. Default is `publish`.
	 *
	 * @return array Editor data.
	 */
	public function get_builder( $post_id, $status = self::STATUS_PUBLISH ) {
		if ( self::STATUS_DRAFT === $status ) {
			$document = Plugin::$instance->documents->get_doc_or_auto_save( $post_id );
		} else {
			$document = Plugin::$instance->documents->get( $post_id );
		}

		if ( $document ) {
			$editor_data = $document->get_elements_raw_data( null, true );
		} else {
			$editor_data = [];
		}

		return $editor_data;
	}

	/**
	 * Get JSON meta.
	 *
	 * Retrieve post meta data, and return the JSON decoded data.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     The meta key to retrieve.
	 *
	 * @return array Decoded JSON data from post meta.
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
	 * Get plain editor.
	 *
	 * Retrieve post data that was saved in the database. Raw data before it
	 * was parsed by elementor.
	 *
	 * @since 1.0.0
	 * @deprecated 2.0.0
	 *
	 * @access public
	 *
	 * @param int    $post_id Post ID.
	 * @param string $status  Optional. Post status. Default is `publish`.
	 *
	 * @return array Post data.
	 */
	public function get_plain_editor( $post_id, $status = self::STATUS_PUBLISH ) {
		// TODO: _deprecated_function( __METHOD__, '2.0.0', '$document->get_elements_data()' );

		$document = Plugin::$instance->documents->get( $post_id );

		return $document->get_elements_data( $status );
	}

	/**
	 * Get auto-saved post revision.
	 *
	 * Retrieve the auto-saved post revision that is newer than current post.
	 *
	 * @since 1.9.0
	 * @deprecated 2.0.0
	 *
	 * @access public
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return \WP_Post|false The auto-saved post, or false.
	 */

	public function get_newer_autosave( $post_id ) {
		// TODO: _deprecated_function( __METHOD__, '2.0.0', '$document->get_newer_autosave()' );

		$document = Plugin::$instance->documents->get( $post_id );

		return $document->get_newer_autosave();
	}

	/**
	 * Get new editor from WordPress editor.
	 *
	 * When editing the with Elementor the first time, the current page content
	 * is parsed into Text Editor Widget that contains the original data.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return array Content in Elementor format.
	 */
	public function _get_new_editor_from_wp_editor( $post_id ) {
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
	 * Is using Elementor.
	 *
	 * Set whether the page is using Elementor or not.
	 *
	 * @since 1.5.0
	 * @access public
	 *
	 * @param int  $post_id      Post ID.
	 * @param bool $is_elementor Optional. Whether the page is elementor page.
	 *                           Default is true.
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
	 * Render element plain content.
	 *
	 * When saving data in the editor, this method renders recursively the plain
	 * content containing only the content and the HTML. No CSS data.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param array $element_data Element data.
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
	 * Save plain text.
	 *
	 * Retrieves the raw content, removes all kind of unwanted HTML tags and saves
	 * the content as the `post_content` field in the database.
	 *
	 * @since 1.9.0
	 * @access public
	 *
	 * @param int $post_id Post ID.
	 */
	public function save_plain_text( $post_id ) {
		$plain_text = $this->get_plain_text( $post_id );

		wp_update_post(
			[
				'ID' => $post_id,
				'post_content' => $plain_text,
			]
		);
	}

	/**
	 * Get editor data.
	 *
	 * Accepts raw Elementor data and return parsed data.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param       $post_id
	 * @param array $data              Raw Elementor post data from the database.
	 * @param bool  $with_html_content Optional. Whether to return content with
	 *                                 HTML or not. Default is false.
	 *
	 * @return array Parsed data.
	 */
	public function _get_editor_data( $post_id, $data, $with_html_content = false ) {
		// Change the current post, so widgets can use `documents->get_current` and other post data
		Plugin::$instance->documents->switch_to_document( $post_id );

		$editor_data = [];

		foreach ( $data as $element_data ) {
			$element = Plugin::$instance->elements_manager->create_element_instance( $element_data );

			if ( ! $element ) {
				continue;
			}

			$editor_data[] = $element->get_raw_data( $with_html_content );
		} // End foreach().

		Plugin::$instance->documents->restore_document();

		return $editor_data;
	}

	/**
	 * Iterate data.
	 *
	 * Accept any type of Elementor data and a callback function. The callback
	 * function runs recursively for each element and his child elements.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array    $data_container Any type of elementor data.
	 * @param callable $callback       A function to iterate data by.
	 *
	 * @return mixed Iterated data.
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
	 * Safely copy Elementor meta.
	 *
	 * Make sure the original page was built with Elementor and the post is not
	 * auto-save. Only then copy elementor meta from one post to another using
	 * `copy_elementor_meta()`.
	 *
	 * @access public
	 *
	 * @param int $from_post_id Original post ID.
	 * @param int $to_post_id   Target post ID.
	 */
	public function safe_copy_elementor_meta( $from_post_id, $to_post_id ) {
		// It's from  WP-Admin & not from Elementor.
		if ( ! did_action( 'elementor/db/before_save' ) ) {

			if ( ! Plugin::$instance->db->is_built_with_elementor( $from_post_id ) ) {
				return;
			}

			// It's an exited Elementor auto-save
			if ( get_post_meta( $to_post_id, '_elementor_data', true ) ) {
				return;
			}
		}

		$this->copy_elementor_meta( $from_post_id, $to_post_id );
	}

	/**
	 * Copy Elementor meta.
	 *
	 * Duplicate the data from one post to another.
	 *
	 * Consider using `safe_copy_elementor_meta()` method instead.
	 *
	 * @since 1.1.0
	 * @access public
	 *
	 * @param int $from_post_id Original post ID.
	 * @param int $to_post_id   Target post ID.
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
	 * Is built with Elementor.
	 *
	 * Check whether the post was built with Elementor.
	 *
	 * @since 1.0.10
	 * @access public
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return bool Whether the post was built with Elementor.
	 */
	public function is_built_with_elementor( $post_id ) {
		return ! ! get_post_meta( $post_id, '_elementor_edit_mode', true );
	}

	/**
	 * Has Elementor in post.
	 *
	 * Check whether the post has Elementor data in the post.
	 *
	 * @since 1.0.10
	 * @deprecated 1.4.0 Use `is_built_with_elementor` instead.
	 * @access public
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return bool Whether the post was built with Elementor.
	 */
	public function has_elementor_in_post( $post_id ) {
		_deprecated_function( sprintf( '%1$s::%2$s', get_called_class(), __FUNCTION__ ), '1.4.0', 'is_built_with_elementor()' );

		return $this->is_built_with_elementor( $post_id );
	}

	/**
	 * Switch to post.
	 *
	 * Change the global WordPress post to the requested post.
	 *
	 * @since 1.5.0
	 * @access public
	 *
	 * @param int $post_id Post ID.
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
	 * Restore current post.
	 *
	 * Rollback to the previous global post, rolling back from `DB::switch_to_post()`.
	 *
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


	/**
	 * @access public
	 *
	 * @param $query_vars array
	 */
	public function switch_to_query( $query_vars ) {
		global $wp_query;
		$current_query_vars = $wp_query->query;

		// If is already switched, or is the same query, return.
		if ( $current_query_vars === $query_vars ) {
			$this->switched_data[] = false;
			return;
		}

		$new_query = new \WP_Query( $query_vars );

		$this->switched_data[] = [
			'switched' => $new_query,
			'original' => $wp_query,
		];

		$wp_query = $new_query;

		if ( $new_query->is_singular() && isset( $new_query->posts[0] ) ) {
			$GLOBALS['post'] = $new_query->posts[0];
			setup_postdata( $GLOBALS['post'] );
		}
	}

	/**
	 * @access public
	 */
	public function restore_current_query() {
		$data = array_pop( $this->switched_data );

		// If not switched, return.
		if ( ! $data ) {
			return;
		}

		global $wp_query;

		$wp_query = $data['original'];

		// Ensure the global post is set only if needed
		unset( $GLOBALS['post'] );

		if ( $wp_query->is_singular() ) {
			$GLOBALS['post'] = $wp_query->posts[0];
			setup_postdata( $GLOBALS['post'] );
		}
	}

	/**
	 * Get plain text.
	 *
	 * Retrieve the post plain text.
	 *
	 * @since 1.9.0
	 * @access public
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string Post plain text.
	 */
	public function get_plain_text( $post_id ) {
		$data = $this->get_plain_editor( $post_id );

		return $this->get_plain_text_from_data( $data );
	}

	/**
	 * Get plain text from data.
	 *
	 * Retrieve the post plain text from any given Elementor data.
	 *
	 * @access public
	 *
	 * @param array $data Post ID.
	 *
	 * @return string Post plain text.
	 */
	public function get_plain_text_from_data( $data ) {
		ob_start();
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

		$plain_text = trim( $plain_text );

		return $plain_text;
	}
}
