<?php
namespace Elementor\Core\Admin\Options;

use Elementor\Core\Options\Site_Option;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Site_CSS_Print_Method extends Site_Option {
	const OPTION_EXTERNAL = 'external';
	const OPTION_INTERNAL = 'internal';

	public static function get_key() {
		return 'css_print_method';
	}

	public static function get_options(){
		return [
			static::OPTION_EXTERNAL => __( 'External File', 'elementor' ),
			static::OPTION_INTERNAL => __( 'Internal Embedding', 'elementor' ),
		];
	}

	public static function get_default() {
		return static::OPTION_EXTERNAL;
	}

	public static function should_autoload() {
		return true;
	}

	public static function is_external() {
		return static::OPTION_EXTERNAL === static::get();
	}

	public static function on_wp_change( $new_value, $old_value = null ) {
		Plugin::$instance->files_manager->clear_cache();
	}

	public static function set_internal() {
		static::set( static::OPTION_INTERNAL );
	}

	public static function set_external() {
		static::set( static::OPTION_EXTERNAL );
	}
}
