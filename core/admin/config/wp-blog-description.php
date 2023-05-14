<?php
namespace Elementor\Core\Admin\Config;

use Elementor\Core\Config\WP_Option_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class WP_Blog_Description extends WP_Option_Base {
	public static function get_key() {
		return 'blogdescription';
	}

	public static function get_default() {
		return '';
	}

	protected static function validate($value) {
		return is_string($value);
	}
}
