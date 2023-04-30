<?php
namespace elementor\core\admin\options;

use Elementor\Core\Options\Site_Option;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Site_Font_Display extends Site_Option {

	const OPTION_AUTO = 'auto';
	const OPTION_BLOCK = 'block';
	const OPTION_SWAP = 'swap';

	public static function get_key() {
		return 'font_display';
	}

	public static function get_options() {
		return [
			self::OPTION_AUTO => __( 'Auto', 'elementor' ),
			self::OPTION_BLOCK => __( 'Block', 'elementor' ),
			self::OPTION_SWAP => __( 'Swap', 'elementor' ),
		];
	}

	public static function get_default() {
		return self::OPTION_AUTO;
	}

	public static function should_autoload() {
		return true;
	}

	Public static function set_block() {
		static::set( self::OPTION_BLOCK );
	}

	Public static function set_swap() {
		static::set( self::OPTION_SWAP );
	}

	Public static function set_auto() {
		static::set( self::OPTION_AUTO );
	}
}
