<?php
namespace Elementor\Includes\Settings\MenuItems;

use Elementor\Core\Admin\Menu\Interfaces\Renderable_Admin_Menu_Item;
use Elementor\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Admin_Menu_Item implements Renderable_Admin_Menu_Item {
	private $settings_page;

	public function __construct( Settings $settings_page ) {
		$this->settings_page = $settings_page;
	}

	public function is_visible() {
		return true;
	}

	public function get_parent_slug() {
		return null;
	}

	public function get_label() {
		return esc_html__( 'Elementor', 'elementor' );
	}

	public function get_page_title() {
		return esc_html__( 'Elementor', 'elementor' );
	}

	public function get_position() {
		return '58.5';
	}

	public function get_capability() {
		return 'manage_options';
	}

	public function callback() {
		$this->settings_page->display_settings_page();
	}
}
