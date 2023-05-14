<?php
namespace Elementor\Core\Admin\Config;

use Elementor\Core\Config\On_Off_Config_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Site_Google_Fonts extends On_Off_Config_Base {

	const CONFIG_TRUE = '1';

	const CONFIG_FALSE = '0';


	public static function get_key() {
		return 'google_font';
	}

	public static function get_default() {
		// TODO: For future use, using for new installs.
		//$is_new_site = Upgrade_Manager::install_compare( '3.10.0', '>=' );
		//$default_value = $is_new_site ? static::OPTION_FALSE : static::OPTION_TRUE;

		return static::CONFIG_TRUE;
	}

	public static function should_autoload() {
		return true;
	}
}
