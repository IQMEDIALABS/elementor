<?php
namespace Elementor\Core\Base;

use Elementor\Core\Utils\Exceptions;
use Elementor\Plugin;
use Elementor\DB;
use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use Elementor\Post_CSS_File;
use Elementor\User;
use Elementor\Core\Settings\Manager as SettingsManager;
use Elementor\Utils;
use Elementor\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

abstract class Document extends Controls_Stack {

	const TYPE_META_KEY = '_elementor_template_type';
	/**
	 * @var \WP_Post
	 */
	protected $post;

	public static function get_properties() {
		return [
			'is_editable' => true,
		];
	}

	public static function get_title() {
		return __( 'Document', 'elementor' );
	}

	public static function get_property( $key ) {
		return self::_get_items( static::get_properties(), $key );
	}

	public static function get_class_full_name() {
		return get_called_class();
	}

	public function get_unique_name() {
		return $this->get_name() . '-' . $this->post->ID;
	}

	public function get_main_id() {
		$post_id = $this->post->ID;
		$parent_post_id = wp_is_post_revision( $post_id );
		if ( $parent_post_id ) {
			$post_id = $parent_post_id;
		}

		return $post_id;
	}

	public function render_element( $data ) {
		// Start buffering
		ob_start();

		/** @var Widget_Base $widget */
		$widget = Plugin::$instance->elements_manager->create_element_instance( $data );

		if ( ! $widget ) {
			throw new \Exception( 'Widget not found.' );
		}

		$widget->render_content();

		$render_html = ob_get_clean();

		return $render_html;
	}

	public function get_main_post() {
		return get_post( $this->get_main_id() );
	}

	public function get_wp_preview_url() {
		$main_post_id = $this->get_main_id();
		$wp_preview_url = get_preview_post_link(
			$main_post_id,
			[
				'preview_nonce' => wp_create_nonce( 'post_preview_' . $main_post_id ),
			]
		);

		/**
		 * Filters the Wordpress preview URL.
		 *
		 * @since 2.0.0
		 *
		 * @param string $wp_preview_url URL with chosen scheme.
		 * @param Document $this Document.
		 */
		return apply_filters( 'elementor/document/wp_preview_url', $wp_preview_url, $this );
	}

	public function get_exit_to_dashboard_url() {
		$exit_url = get_edit_post_link( $this->get_main_id(), 'raw' );

		/**
		 * Filters the Exit To Dashboard URL.
		 *
		 * @since 2.0.0
		 *
		 * @param string $exit_url Default exit URL.
		 * @param Document $this Document.
		 */
		$exit_url = apply_filters( 'elementor/document/urls/exit_to_dashboard', $exit_url, $this );

		return $exit_url;
	}

	/**
	 * Get auto-saved post revision.
	 *
	 * Retrieve the auto-saved post revision that is newer than current post.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 *
	 * @return bool|Document
	 */

	public function get_newer_autosave() {
		$autosave = $this->get_autosave();

		// Detect if there exists an autosave newer than the post.
		if ( $autosave && mysql2date( 'U', $autosave->get_post()->post_modified_gmt, false ) > mysql2date( 'U', $this->post->post_modified_gmt, false ) ) {
			return $autosave;
		}

		return false;
	}

	public function is_autosave() {
		return wp_is_post_autosave( $this->post->ID );
	}

	/**
	 * @param int  $user_id
	 * @param bool $create
	 *
	 * @return bool|Document
	 */
	public function get_autosave( $user_id = 0, $create = false ) {
		if ( ! $user_id ) {
			$user_id = get_current_user_id();
		}

		$autosave_id = $this->get_autosave_id( $user_id );

		if ( $autosave_id ) {
			$document = Plugin::$instance->documents->get( $autosave_id );
		} elseif ( $create ) {
			$autosave_id = wp_create_post_autosave( [
				'post_ID' => $this->post->ID,
				'post_type' => $this->post->post_type,
				'post_title' => $this->post->post_title,
				'post_excerpt' => $this->post->post_excerpt,
				// Hack to cause $autosave_is_different=true in `wp_create_post_autosave`.
				'post_content' => '<!-- Created With Elementor -->',
				'post_modified' => current_time( 'mysql' ),
			] );

			Plugin::$instance->db->copy_elementor_meta( $this->post->ID, $autosave_id );

			$document = Plugin::$instance->documents->get( $autosave_id );
			$document->save_type();
		} else {
			$document = false;
		}

		return $document;
	}

	public function is_editable_by_current_user() {
		return User::is_current_user_can_edit( $this->get_main_id() );
	}

	protected function _get_initial_config() {
		return [
			'id' => $this->get_main_id(),
			'type' => $this->get_name(),
			'last_edited' => $this->get_last_edited(),
			'messages' => [
				'publish_notification' => sprintf( __( 'Hurray! Your %s is live.', 'elementor' ), $this::get_title() ),
			],
			'urls' => [
				'exit_to_dashboard' => $this->get_exit_to_dashboard_url(),
				'preview' => $this->get_preview_url(),
				'wp_preview' => $this->get_wp_preview_url(),
				'permalink' => $this->get_permalink(),
			],
		];
	}

	/**
	 * Initialize controls.
	 *
	 * Register the all controls added by `_register_controls()`.
	 * and add the `advanced_settings` at end of Settings Tab
	 *
	 * @since 2.0.0
	 * @access protected
	 */
	protected function init_controls() {
		parent::init_controls();

		$this->start_controls_section(
			'advanced_settings',
			[
				'label' => __( 'Advanced', 'elementor' ),
				'tab' => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'clear_page',
			[
				'type' => Controls_Manager::BUTTON,
				'label' => __( 'Delete All Content', 'elementor' ),
				'text' => __( 'Delete', 'elementor' ),
				'separator' => 'before',
				'event' => 'elementor:clearPage',
			]
		);

		$this->end_controls_section();
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'document_settings',
			[
				'label' => __( 'Document Settings', 'elementor' ),
				'tab' => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'post_title',
			[
				'label' => __( 'Title', 'elementor' ),
				'type' => Controls_Manager::TEXT,
				'default' => $this->post->post_title,
				'label_block' => true,
				'separator' => 'none',
			]
		);

		$post_type_object = get_post_type_object( $this->post->post_type );

		$can_publish = $post_type_object && current_user_can( $post_type_object->cap->publish_posts );
		$is_published = DB::STATUS_PUBLISH === $this->post->post_status || DB::STATUS_PRIVATE === $this->post->post_status;

		if ( $is_published || $can_publish || ! Plugin::$instance->editor->is_edit_mode() ) {

			$this->add_control(
				'post_status',
				[
					'label' => __( 'Status', 'elementor' ),
					'type' => Controls_Manager::SELECT,
					'default' => $this->get_main_post()->post_status,
					'options' => get_post_statuses(),
				]
			);
		}

		$this->end_controls_section();

		do_action( 'elementor/documents/register_controls', $this );
	}

	public function save( $data ) {
		if ( ! $this->is_editable_by_current_user() ) {
			return false;
		}

		if ( DB::STATUS_AUTOSAVE === $this->post->post_status ) {
			if ( ! defined( 'DOING_AUTOSAVE' ) ) {
				define( 'DOING_AUTOSAVE', true );
			}
		}

		if ( ! empty( $data['settings'] ) ) {
			$page_settings_manager = SettingsManager::get_settings_managers( 'page' );
			$page_settings_manager->ajax_before_save_settings( $data['settings'], $this->post->ID );
			$page_settings_manager->save_settings( $data['settings'], $this->post->ID );
		}

		// Refresh post after save settings.
		$this->post = get_post( $this->post->ID );

		// TODO: refresh settings.
		$this->save_elements( $data['elements'] );

		// Remove Post CSS
		delete_post_meta( $this->post->ID, Post_CSS_File::META_KEY );

		return true;
	}

	/**
	 * Is built with Elementor.
	 *
	 * Check whether the post was built with Elementor.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return bool Whether the post was built with Elementor.
	 */
	public function is_built_with_elementor() {
		return ! ! get_post_meta( $this->post->ID, '_elementor_edit_mode', true );
	}

	/**
	 * @static
	 * @since 2.0.0
	 * @access public
	 *
	 * @return mixed
	 */
	public function get_edit_url() {
		$edit_link = add_query_arg(
			[
				'post' => $this->get_main_id(),
				'action' => 'elementor',
			],
			admin_url( 'post.php' )
		);

		return apply_filters( 'elementor/document/get_edit_link', $edit_link, $this );
	}

	/**
	 * @static
	 * @since 2.0.0
	 * @access public
	 */
	public function get_preview_url() {
		$preview_url = set_url_scheme( add_query_arg( 'elementor-preview', $this->get_main_id(), $this->get_permalink() ) );

		return apply_filters( 'elementor/document/preview_url', $preview_url, $this );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param string $key
	 *
	 * @return array
	 */
	public function get_json_meta( $key ) {
		$meta = get_post_meta( $this->post->ID, $key, true );

		if ( is_string( $meta ) && ! empty( $meta ) ) {
			$meta = json_decode( $meta, true );
		}

		if ( empty( $meta ) ) {
			$meta = [];
		}

		return $meta;
	}

	public function get_elements_raw_data( $data = null, $with_html_content = false ) {
		if ( is_null( $data ) ) {
			$data = $this->get_elements_data();
		}

		// Change the current documents, so widgets can use `documents->get_current` and other post data
		Plugin::$instance->documents->switch_to_document( $this );

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
	 * @since  2.0.0
	 * @access public
	 *
	 * @param string $status
	 *
	 * @return array
	 */
	public function get_elements_data( $status = DB::STATUS_PUBLISH ) {
		$elements = $this->get_json_meta( '_elementor_data' );

		if ( DB::STATUS_DRAFT === $status ) {
			$autosave = $this->get_newer_autosave();

			if ( is_object( $autosave ) ) {
				$autosave_elements = Plugin::$instance->documents
					->get( $autosave->get_post()->ID )
					->get_json_meta( '_elementor_data' );
			}
		}

		if ( Plugin::$instance->editor->is_edit_mode() ) {
			if ( empty( $elements ) && empty( $autosave_elements ) ) {
				$elements = Plugin::$instance->db->_get_new_editor_from_wp_editor( $this->post->ID );
			}
		}

		if ( ! empty( $autosave_elements ) ) {
			$elements = $autosave_elements;
		}

		return $elements;
	}

	public function get_css_wrapper_selector() {
		return 'elementor-' . $this->get_id();
	}

	public function get_panel_page_settings() {
		return [
			'title' => self::get_title() . ' ' . __( 'Settings', 'elementor' ),
		];
	}

	public function get_post() {
		return $this->post;
	}

	public function get_permalink() {
		return get_permalink( $this->get_main_id() );
	}

	public function delete() {
		if ( 'revision' === $this->post->post_type ) {
			$deleted = wp_delete_post_revision( $this->post );
		} else {
			$deleted = wp_delete_post( $this->post->ID );
		}

		return $deleted && ! is_wp_error( $deleted );
	}

	/**
	 * Save editor elements.
	 *
	 * Save data from the editor to the database.
	 *
	 * @since  2.0.0
	 * @access public
	 *
	 * @param array $elements
	 */
	protected function save_elements( $elements ) {
		$editor_data = $this->get_elements_raw_data( $elements );

		// We need the `wp_slash` in order to avoid the unslashing during the `update_post_meta`
		$json_value = wp_slash( wp_json_encode( $editor_data ) );

		// Don't use `update_post_meta` that can't handle `revision` post type
		$is_meta_updated = update_metadata( 'post', $this->post->ID, '_elementor_data', $json_value );

		/**
		 * Fires before Elementor saves data to the database.
		 *
		 * @since 1.0.0
		 *
		 * @param string   $status          Post status.
		 * @param int|bool $is_meta_updated Meta ID if the key didn't exist, true on successful update, false on failure.
		 */
		do_action( 'elementor/db/before_save', $this->post->post_status, $is_meta_updated );

		Plugin::$instance->db->save_plain_text( $this->post->ID );

		update_metadata( 'post', $this->post->ID, '_elementor_version', DB::DB_VERSION );

		/**
		 * Fires after Elementor saves data to the database.
		 *
		 * @since 1.0.0
		 *
		 * @param int   $post_id     The ID of the post.
		 * @param array $editor_data Sanitize posted data.
		 */
		do_action( 'elementor/editor/after_save', $this->post->ID, $editor_data );
	}

	public function get_autosave_id( $user_id = 0 ) {
		$autosave = Utils::get_post_autosave( $this->post->ID, $user_id );
		if ( $autosave ) {
			return $autosave->ID;
		}

		return false;
	}

	public function save_type() {
		update_post_meta( $this->post->ID, self::TYPE_META_KEY, $this->get_name() );
	}

	public function get_main_meta( $key ) {
		return get_post_meta( $this->get_main_id(), $key, true );
	}

	public function get_meta( $key ) {
		return get_post_meta( $this->post->ID, $key, true );
	}

	public function update_meta( $key, $value ) {
		// Use `update_metadata` in order to save also for revisions.
		return update_metadata( 'post', $this->post->ID, $key, $value );
	}

	public function get_last_edited() {
		$post = $this->post;
		$autosave_post = $this->get_autosave();

		if ( $autosave_post ) {
			$post = $autosave_post->get_post();
		}

		$date = date_i18n( _x( 'M j, H:i', 'revision date format', 'elementor' ), strtotime( $post->post_modified ) );
		$display_name = get_the_author_meta( 'display_name' , $post->post_author );

		if ( $autosave_post || 'revision' === $post->post_type ) {
			/* translators: 1: Saving date, 2: Author display name */
			$last_edited = sprintf( __( 'Draft saved on %1$s by %2$s', 'elementor' ), '<time>' . $date . '</time>', $display_name );
		} else {
			/* translators: 1: Editing date, 2: Author display name */
			$last_edited = sprintf( __( 'Last edited on %1$s by %2$s', 'elementor' ), '<time>' . $date . '</time>', $display_name );
		}

		return $last_edited;
	}

	public function __construct( array $data = [] ) {
		if ( $data ) {
			if ( empty( $data['post_id'] ) ) {
				$this->post = new \WP_Post( (object) [] );
			} else {
				$this->post = get_post( $data['post_id'] );

				if ( ! $this->post ) {
					throw new \Exception( 'Post ID #' . $data['post_id'] . ' is not exist.', Exceptions::NOT_FOUND );
				}
			}

			// Each Control_Stack is based on a unique ID.
			$data['id'] = $data['post_id'];

			if ( ! isset( $data['settings'] ) ) {
				$data['settings'] = [];
			}

			$saved_settings = get_post_meta( $this->post->ID, '_elementor_page_settings', true );
			if ( ! empty( $saved_settings ) ) {
				$data['settings'] += $saved_settings;
			}
		}

		parent::__construct( $data );
	}
}
