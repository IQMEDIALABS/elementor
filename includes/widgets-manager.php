<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widgets_Manager {

	/**
	 * @var Widget_Base[]
	 */
	protected $_register_widgets = null;

	protected $widgets_folder_path = null;

	private function _init_widgets() {

		$this->widgets_folder_path = apply_filters( 'elementor/widgets/widgets_folder_path', ELEMENTOR_PATH . 'includes/widgets/' );

		include_once( ELEMENTOR_PATH . 'includes/elements/base.php' );
		include( $this->widgets_folder_path . 'base.php' );

		$build_widgets_filename = [
			'heading',
			'image',
			'text-editor',
			'video',
			'button',
			'divider',
			'spacer',
			'image-box',
			'google-maps',
			'icon',
			'icon-box',
			'image-gallery',
			'image-carousel',
			'icon-list',
			'counter',
			'progress',
			'testimonial',
			'tabs',
			'accordion',
			'toggle',
			'social-icons',
			'alert',
			'audio',
			'html',
			'menu-anchor',
			'sidebar',
		];

		/**
         * Allow override of registered widget defaults
         *
         * @since 0.6.5
        *
        * @param array $build_widgets_filename.
        */
        $build_widgets_filename = apply_filters( 'elementor/widgets/widget_filenames', $build_widgets_filename );

		$this->_register_widgets = [];

		foreach ( $build_widgets_filename as $widget_filename ) {

			$widget_filename_path = $this->widgets_folder_path . $widget_filename . '.php';

			$widget_filename_path = apply_filters( "elementor/widgets/{$widget_filename}_file_path", $widget_filename_path, $widget_filename );

			if ( ! file_exists( $widget_filename_path ) ) {
				continue;
			}

			include( $widget_filename_path );

			$class_name = ucwords( $widget_filename );
			$class_name = str_replace( '-', '_', $class_name );
			$class_name = __NAMESPACE__ . '\Widget_' . $class_name;

			$class_name = apply_filters( "elementor/widgets/{$widget_filename}_class_name", $class_name, $widget_filename );

			$this->register_widget( $class_name );
		}

		$this->_register_wp_widgets();

		do_action( 'elementor/widgets/widgets_registered' );
	}

	private function _register_wp_widgets() {
		global $wp_widget_factory;

		$widget_filename_path = $this->widgets_folder_path . 'wordpress.php';

		$widget_filename_path = apply_filters( "elementor/widgets/wordpress_file_path", $widget_filename_path );

		include( $widget_filename_path);

		foreach ( $wp_widget_factory->widgets as $widget_class => $widget_obj ) {
			// Skip Pojo widgets
			$allowed_widgets = [
				'Pojo_Widget_Recent_Posts',
				'Pojo_Widget_Posts_Group',
				'Pojo_Widget_Gallery',
				'Pojo_Widget_Recent_Galleries',
				'Pojo_Slideshow_Widget',
				'Pojo_Forms_Widget',
				'Pojo_Widget_News_Ticker',
			];

			/**
             * Allow override of allowed widgets
             *
             * @since 0.6.5
            *
            * @param array $allowed_widgets.
            */
            $allowed_widgets = apply_filters( 'elementor/widgets/allowed_widgets', $allowed_widgets );

			if ( $widget_obj instanceof \Pojo_Widget_Base && ! in_array( $widget_class, $allowed_widgets ) ) {
				continue;
			}

			$this->register_widget( __NAMESPACE__ . '\Widget_WordPress', [ 'widget_name' => $widget_class ] );
		}
	}

	public function register_widget( $widget_class, $args = [] ) {
		if ( ! class_exists( $widget_class ) ) {
			return new \WP_Error( 'widget_class_name_not_exists' );
		}

		$widget_instance = new $widget_class( $args );

		if ( ! $widget_instance instanceof Widget_Base ) {
			return new \WP_Error( 'wrong_instance_widget' );
		}
		$this->_register_widgets[ $widget_instance->get_id() ] = $widget_instance;

		return true;
	}

	public function unregister_widget( $id ) {
		if ( ! isset( $this->_register_widgets[ $id ] ) ) {
			return false;
		}
		unset( $this->_register_widgets[ $id ] );
		return true;
	}

	public function get_register_widgets() {
		if ( is_null( $this->_register_widgets ) ) {
			$this->_init_widgets();
		}
		return $this->_register_widgets;
	}

	public function get_widget( $id ) {
		$widgets = $this->get_register_widgets();

		if ( ! isset( $widgets[ $id ] ) ) {
			return false;
		}
		return $widgets[ $id ];
	}

	public function get_register_widgets_data() {
		$data = [];
		foreach ( $this->get_register_widgets() as $widget ) {
			$data[ $widget->get_id() ] = $widget->get_data();
		}
		return $data;
	}

	public function ajax_render_widget() {
		if ( empty( $_POST['_nonce'] ) || ! wp_verify_nonce( $_POST['_nonce'], 'elementor-editing' ) ) {
			wp_send_json_error( new \WP_Error( 'token_expired' ) );
		}

		if ( empty( $_POST['post_id'] ) ) {
			wp_send_json_error( new \WP_Error( 'no_post_id', 'No post_id' ) );
		}

		if ( ! User::is_current_user_can_edit( $_POST['post_id'] ) ) {
			wp_send_json_error( new \WP_Error( 'no_access' ) );
		}

		// Override the global $post for the render
		$GLOBALS['post'] = get_post( (int) $_POST['post_id'] );

		$data = json_decode( stripslashes( html_entity_decode( $_POST['data'] ) ), true );

		// Start buffering
		ob_start();
		$widget = $this->get_widget( $data['widgetType'] );
		if ( false !== $widget ) {
			$data['settings'] = $widget->get_parse_values( $data['settings'] );
			$widget->render_content( $data['settings'] );
		}

		$render_html = ob_get_clean();

		wp_send_json_success(
			[
				'render' => $render_html,
			]
		);
	}

	public function ajax_get_wp_widget_form() {
		if ( empty( $_POST['_nonce'] ) || ! wp_verify_nonce( $_POST['_nonce'], 'elementor-editing' ) ) {
			die;
		}

		$widget_type = $_POST['widget_type'];
		$widget_obj = $this->get_widget( $widget_type );

		if ( ! $widget_obj instanceof Widget_WordPress ) {
			die;
		}

		$data = json_decode( stripslashes( html_entity_decode( $_POST['data'] ) ), true );
		echo $widget_obj->get_form( $data );
		die;
	}

	public function render_widgets_content() {
		foreach ( $this->get_register_widgets() as $widget ) {
			$widget->print_template();
		}
	}

	public function __construct() {
		add_action( 'wp_ajax_elementor_render_widget', [ $this, 'ajax_render_widget' ] );
		add_action( 'wp_ajax_elementor_editor_get_wp_widget_form', [ $this, 'ajax_get_wp_widget_form' ] );
	}
}
