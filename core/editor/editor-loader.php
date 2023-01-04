<?php
namespace Elementor\Core\Editor;

use Elementor\Core\Editor\Config_Providers\Config_Provider_Interface;
use Elementor\Core\Utils\Collection;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Editor_Loader {
	/**
	 * @var Config_Provider_Interface
	 */
	private $config_provider;

	/**
	 * @param Config_Provider_Interface $config_provider
	 */
	public function __construct( Config_Provider_Interface $config_provider ) {
		$this->config_provider = $config_provider;
	}

	/**
	 * @return void
	 */
	public function register_scripts() {
		$script_configs = $this->normalize_asset_configs(
			$this->config_provider->get_script_configs(),
			'script'
		);

		foreach ( $script_configs as $script_config ) {
			wp_register_script(
				$script_config['handle'],
				$script_config['src'],
				$script_config['deps'],
				$script_config['version'],
				$script_config['in_footer']
			);
		}
	}

	/**
	 * @return void
	 */
	public function enqueue_scripts() {
		foreach ( $this->config_provider->get_script_handles_to_enqueue() as $script_handle ) {
			wp_enqueue_script( $script_handle );
		}
	}

	/**
	 * @return void
	 */
	public function register_styles() {
		$styles_config = $this->normalize_asset_configs(
			$this->config_provider->get_style_configs(),
			'style'
		);

		foreach ( $styles_config as $style_config ) {
			wp_register_style(
				$style_config['handle'],
				$style_config['src'],
				$style_config['deps'],
				$style_config['version'],
				$style_config['media']
			);
		}
	}

	/**
	 * @return void
	 */
	public function enqueue_styles() {
		foreach ( $this->config_provider->get_style_handles_to_enqueue() as $style_handle ) {
			wp_enqueue_style( $style_handle );
		}
	}

	/**
	 * @return void
	 */
	public function print_root_template() {
		// Exposing the path for the view part to render the body of the editor template.
		$body_file_path = $this->config_provider->get_template_body_file_path();

		include ELEMENTOR_PATH . 'includes/editor-templates/editor-wrapper.php';
	}

	/**
	 * Normalize script/style configs to enqueue and register methods.
	 *
	 * @param array $script_configs
	 * @param string $type can be ['script', 'style']
	 *
	 * @return array
	 */
	private function normalize_asset_configs( array $script_configs, $type ) {
		$additional_defaults = 'style' === $type ?
			[ 'media' => 'all' ] :
			[ 'in_footer' => true ];

		$default = array_merge( [
			'handle' => '',
			'src' => '',
			'deps' => [],
			'version' => ELEMENTOR_VERSION,
			'in_footer' => true,
		], $additional_defaults );

		$replacements = [
			'{{ASSETS_URL}}' => ELEMENTOR_ASSETS_URL,
			'{{MIN_SUFFIX}}' => ( Utils::is_script_debug() || Utils::is_elementor_tests() ) ? '' : '.min',
			'{{DIRECTION_SUFFIX}}' => is_rtl() ? '-rtl' : '',
		];

		return Collection::make( $script_configs )
			->filter( function ( $config ) {
				return ! empty( $config['handle'] ) && ! empty( $config['src'] );
			} )
			->map( function ( $config ) use ( $default, $replacements ) {
				// Assign default values.
				$config = wp_parse_args( $config, $default );

				// Replace placeholders with actual values.
				foreach ( $replacements as $replacement_key => $replacement_value ) {
					$config['src'] = str_replace(
						$replacement_key,
						$replacement_value,
						$config['src']
					);
				}

				return $config;
			} )
			->all();
	}
}
