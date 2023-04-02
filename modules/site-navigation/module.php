<?php

namespace Elementor\Modules\SiteNavigation;

use Elementor\Core\Base\Module as Module_Base;
use Elementor\Modules\SiteNavigation\Data\Controller;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends Module_Base {

	/**
	 * Initialize the Container-Converter module.
	 *
	 * @return void
	 */
	public function __construct() {
		Plugin::$instance->data_manager_v2->register_controller( new Controller() );

	}

	/**
	 * Retrieve the module name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'site-navigation';
	}

	/**
	 * Determine whether the module is active.
	 *
	 * @return bool
	 */
	public static function is_active() {
		if ( defined( 'ELEMENTOR_TESTS' ) && ELEMENTOR_TESTS ) {
			return true;
		}

		return Plugin::$instance->experiments->is_feature_active( 'editor_v2' );
	}
}
