<?php
namespace Elementor\Core\Editor\Loader\V1;

use Elementor\Core\Editor\Loader\Common\Editor_Common_Scripts_Settings;
use Elementor\Core\Editor\Loader\Editor_Base_Loader;
use Elementor\Core\Utils\Assets_Config_Provider;
use Elementor\Core\Utils\Collection;
use Elementor\Plugin;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Editor_V1_Loader extends Editor_Base_Loader {
	/**
	 * @var Assets_Config_Provider
	 */
	protected $assets_config_provider;

	/**
	 * @param Collection $config
	 */
	public function __construct( Collection $config ) {
		parent::__construct( $config );

		$this->assets_config_provider = new Assets_Config_Provider();
	}

	/**
	 * @return void
	 */
	public function init() {
		parent::init();

		$packages_to_register = [ 'ui', 'icons' ];

		$assets_path = $this->config->get( 'assets-path' );

		foreach ( $packages_to_register as $package ) {
			$this->assets_config_provider->load(
				$package,
				"{$assets_path}js/packages/{$package}/{$package}.asset.php"
			);
		}
	}

	/**
	 * @return void
	 */
	public function register_scripts() {
		parent::register_scripts();

		$assets_url = $this->config->get( 'assets-url' );
		$min_suffix = $this->config->get( 'min-suffix' );

		foreach ( $this->assets_config_provider->all() as $package => $config ) {
			wp_register_script(
				$config['handle'],
				"{$assets_url}js/packages/{$package}/{$package}{$min_suffix}.js",
				$config['deps'],
				ELEMENTOR_VERSION,
				true
			);
		}

		wp_register_script(
			'elementor-responsive-bar',
			"{$assets_url}js/responsive-bar{$min_suffix}.js",
			[ 'elementor-editor' ],
			ELEMENTOR_VERSION,
			true
		);

		wp_register_script(
			'elementor-editor-loader-v1',
			"{$assets_url}js/editor-loader-v1{$min_suffix}.js",
			[ 'elementor-editor' ],
			ELEMENTOR_VERSION,
			true
		);
	}

	/**
	 * @return void
	 */
	public function enqueue_scripts() {
		parent::enqueue_scripts();

		wp_enqueue_script( 'elementor-responsive-bar' );
		wp_set_script_translations( 'elementor-responsive-bar', 'elementor' );

		// Must be last.
		wp_enqueue_script( 'elementor-editor-loader-v1' );

		wp_set_script_translations( 'elementor-editor', 'elementor' );

		Utils::print_js_config(
			'elementor-editor',
			'ElementorConfig',
			Editor_Common_Scripts_Settings::get()
		);
	}

	/**
	 * @return void
	 */
	public function register_styles() {
		parent::register_styles();

		$assets_url = $this->config->get( 'assets-url' );
		$min_suffix = $this->config->get( 'min-suffix' );

		wp_register_style(
			'elementor-responsive-bar',
			"{$assets_url}css/responsive-bar{$min_suffix}.css",
			[],
			ELEMENTOR_VERSION
		);
	}

	public function enqueue_styles() {
		parent::enqueue_styles();

		wp_enqueue_style( 'elementor-responsive-bar' );
	}

	/**
	 * @return void
	 */
	public function print_root_template() {
		// Exposing the path for the view part to render the body of the editor template.
		$body_file_path = __DIR__ . '/templates/editor-body-v1.view.php';

		include ELEMENTOR_PATH . 'includes/editor-templates/editor-wrapper.php';
	}

	/**
	 * @return void
	 */
	public function register_additional_templates() {
		parent::register_additional_templates();

		Plugin::$instance->common->add_template( ELEMENTOR_PATH . 'includes/editor-templates/responsive-bar.php' );
	}
}
