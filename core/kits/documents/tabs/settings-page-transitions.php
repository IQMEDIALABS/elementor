<?php
namespace Elementor\Core\Kits\Documents\Tabs;

use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Settings_Page_Transitions extends Tab_Base {

	const TAB_ID = 'settings-page-transitions';

	public function get_id() {
		return self::TAB_ID;
	}

	public function get_title() {
		return __( 'Page Transitions', 'elementor' );
	}

	public function get_group() {
		return 'settings';
	}

	public function get_icon() {
		return 'eicon-layout-settings';
	}

	public function get_help_url() {
		return 'https://go.elementor.com/page-transitions';
	}

	protected function register_tab_controls() {
		Plugin::$instance->controls_manager->add_page_transitions_controls( $this->parent, $this->get_id() );
	}
}
