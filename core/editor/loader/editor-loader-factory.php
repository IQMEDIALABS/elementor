<?php
namespace Elementor\Core\Editor\Loader;

use Elementor\Core\Editor\Editor;
use Elementor\Core\Editor\Loader\V1\Editor_V1_Loader;
use Elementor\Core\Editor\Loader\V2\Editor_V2_Loader;
use Elementor\Core\Utils\Assets_Config_Provider;
use Elementor\Core\Utils\Placeholder_Replacer;
use Elementor\Plugin;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Editor_Loader_Factory {
	/**
	 * @return Editor_Loader_Interface
	 */
	public static function create() {
		$is_editor_v2_active = Plugin::$instance->experiments->is_feature_active( Editor::EDITOR_V2_EXPERIMENT_NAME );

		// Nonce verification is not required, using param for routing purposes.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$editor_version = Utils::get_super_global_value( $_GET, 'v' ) ?? ( $is_editor_v2_active ? '2' : '1' );

		$placeholder_replacer = new Placeholder_Replacer( [
			'{{ASSETS_URL}}' => ELEMENTOR_ASSETS_URL,
			'{{ASSETS_PATH}}' => ELEMENTOR_ASSETS_PATH,
			'{{MIN_SUFFIX}}' => ( Utils::is_script_debug() || Utils::is_elementor_tests() ) ? '' : '.min',
			'{{DIRECTION_SUFFIX}}' => is_rtl() ? '-rtl' : '',
		] );

		$assets_config_provider = new Assets_Config_Provider( [] );

		if ( '2' === $editor_version ) {
			return new Editor_V2_Loader( $placeholder_replacer, $assets_config_provider );
		}

		return new Editor_V1_Loader( $placeholder_replacer, $assets_config_provider );
	}
}
