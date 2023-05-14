<?php
namespace Elementor\Core\Admin\Config;

use Elementor\Core\Config\Config_On_Off_Trait;
use Elementor\Core\Config\Site_Config_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Site_Google_Fonts extends Site_Config_Base {

	use Config_On_Off_Trait;

	const VALUE_TRUE = '1';

	const VALUE_FALSE = '0';


	public static function get_key(): string {
		return 'google_font';
	}

	public static function get_default() {
		// TODO: For future use, using for new installs.
		//$is_new_site = Upgrade_Manager::install_compare( '3.10.0', '>=' );
		//$default_value = $is_new_site ? static::OPTION_FALSE : static::OPTION_TRUE;

		return static::VALUE_TRUE;
	}

	public static function should_autoload() : bool {
		return true;
	}
}
