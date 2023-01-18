<?php
namespace Elementor\Core\Editor\Config_Providers;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Editor_V2_Config_Provider implements Config_Provider_Interface {
	public function get_script_configs() {
		// TODO: Hook to register script configs.

		return array_merge(
			Editor_Common_Assets::get_script_configs(),
			[
				[
					'handle' => 'elementor-packages-locations',
					'src' => '{{ELEMENTOR_ASSETS_URL}}js/packages/locations{{MIN_SUFFIX}}.js',
					'deps' => [ 'react' ],
					'i18n' => [
						'domain' => 'elementor',
						'replace_requested_file' => true,
					],
				],
				[
					'handle' => 'elementor-packages-top-bar',
					'src' => '{{ELEMENTOR_ASSETS_URL}}js/packages/top-bar{{MIN_SUFFIX}}.js',
					'deps' => [ 'react', 'elementor-packages-editor', 'elementor-packages-ui', 'wp-i18n' ],
					'i18n' => [
						'domain' => 'elementor',
						'replace_requested_file' => true,
					],
				],
				[
					'handle' => 'elementor-packages-editor',
					'src' => '{{ELEMENTOR_ASSETS_URL}}js/packages/editor{{MIN_SUFFIX}}.js',
					'deps' => [
						'react',
						'react-dom',
						'elementor-packages-locations',
						'elementor-packages-ui',
						'elementor-packages-v1-adapters',
					],
					'i18n' => [
						'domain' => 'elementor',
						'replace_requested_file' => true,
					],
				],
				[
					'handle' => 'elementor-packages-ui',
					'src' => '{{ELEMENTOR_ASSETS_URL}}js/packages/ui{{MIN_SUFFIX}}.js',
					'deps' => [ 'react', 'react-dom' ],
					'i18n' => [
						'domain' => 'elementor',
						'replace_requested_file' => true,
					],
				],
				[
					'handle' => 'elementor-packages-v1-adapters',
					'src' => '{{ELEMENTOR_ASSETS_URL}}js/packages/v1-adapters{{MIN_SUFFIX}}.js',
				],

				// Loader script
				[
					'handle' => 'elementor-editor-loader-v2',
					'src' => '{{ELEMENTOR_ASSETS_URL}}js/editor-loader-v2{{MIN_SUFFIX}}.js',
					'deps' => [
						'elementor-editor',
						'elementor-packages-editor',
					],
				],
			]
		);
	}

	public function get_script_handles_to_enqueue() {
		// TODO: Hook to enqueue scripts.

		return [
			'elementor-packages-top-bar',

			// Loader script - must be last.
			'elementor-editor-loader-v2',
		];
	}

	public function get_style_configs() {
		return array_merge(
			Editor_Common_Assets::get_style_configs(),
			[
				[
					'handle' => 'elementor-editor-v2-overrides',
					'src' => '{{ELEMENTOR_ASSETS_URL}}css/editor-v2-overrides{{MIN_SUFFIX}}.css',
					'deps' => [ 'elementor-editor' ],
				],
			]
		);
	}

	public function get_style_handles_to_enqueue() {
		return [
			'elementor-editor-v2-overrides',
			'elementor-editor',
		];
	}

	public function get_template_body_file_path() {
		return __DIR__ . '/../templates/editor-body-v2.view.php';
	}
}
