<?php
namespace Elementor\Modules\ElementManager;

use Elementor\Modules\Usage\Module as Usage_Module;
use Elementor\Api;
use Elementor\Plugin;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Ajax {

	public function register_endpoints() {
		add_action( 'wp_ajax_elementor_element_manager_get_admin_app_data', [ $this, 'ajax_get_admin_page_data' ] );
		add_action( 'wp_ajax_elementor_element_manager_save_disabled_elements', [ $this, 'ajax_save_disabled_elements' ] );
		add_action( 'wp_ajax_elementor_element_manager_get_widgets_usage', [ $this, 'ajax_get_widgets_usage' ] );
	}

	public function ajax_get_admin_page_data() {
		$this->verify_permission();
		$this->force_enabled_all_elements();

		$widgets = [];
		$plugins = [];

		foreach ( Plugin::$instance->widgets_manager->get_widget_types() as $widget ) {
			if ( ! $widget->show_in_panel() ) {
				continue;
			}

			$plugin_name = $this->get_plugin_name_from_widget_instance( $widget );

			if ( ! in_array( $plugin_name, $plugins ) ) {
				$plugins[] = $plugin_name;
			}

			$widgets[] = [
				'name' => $widget->get_name(),
				'plugin' => $plugin_name,
				'title' => $widget->get_title(),
			];
		}

		$data = [
			'disabled_elements' => Options::get_disabled_elements(),
			'promotion_widgets' => [],
			'widgets' => $widgets,
			'plugins' => $plugins,
		];

		if ( ! Utils::has_pro() ) {
			$data['promotion_widgets'] = Api::get_promotion_widgets();
		}

		wp_send_json_success( $data );
	}

	private function verify_permission() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( __( 'You do not have permission to edit these settings.', 'elementor' ) );
		}

		if ( empty( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'e-element-manager-app' ) ) {
			wp_send_json_error( __( 'Invalid nonce.', 'elementor' ) );
		}
	}

	private function force_enabled_all_elements() {
		remove_all_filters( 'elementor/widgets/is_widget_enabled' );
	}

	private function get_plugin_name_from_widget_instance( $widget ) {
		$class_reflection = new \ReflectionClass( $widget );

		$plugin_basename = plugin_basename( $class_reflection->getFileName() );

		$plugin_directory = strtok( $plugin_basename, '/' );

		$plugins_data = get_plugins( '/' . $plugin_directory );
		$plugin_data = array_shift( $plugins_data );

		return $plugin_data['Name'] ?? __( 'Unknown', 'elementor' );
	}

	public function ajax_save_disabled_elements() {
		$this->verify_permission();

		if ( empty( $_POST['widgets'] ) ) {
			wp_send_json_error( __( 'No elements to save.', 'elementor' ) );
		}

		$disabled_elements = json_decode( wp_unslash( $_POST['widgets'] ) );

		if ( ! is_array( $disabled_elements ) ) {
			wp_send_json_error( __( 'Unexpected elements data.', 'elementor' ) );
		}

		Options::update_disabled_elements( $disabled_elements );

		wp_send_json_success();
	}

	public function ajax_get_widgets_usage() {
		$this->verify_permission();

		/** @var Usage_Module $usage_module */
		$usage_module = Usage_Module::instance();
		$usage_module->recalc_usage();

		$widgets_usage = [];
		foreach ( $usage_module->get_formatted_usage( 'raw' ) as $data ) {
			foreach ( $data['elements'] as $element => $count ) {
				if ( ! isset( $widgets_usage[ $element ] ) ) {
					$widgets_usage[ $element ] = 0;
				}

				$widgets_usage[ $element ] += $count;
			}
		}

		wp_send_json_success( $widgets_usage );
	}
}
