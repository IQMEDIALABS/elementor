<?php

namespace Elementor\Modules\Promotions\AdminMenuItems;

use Elementor\Core\Admin\Menu\Interfaces\Admin_Menu_Item_With_Page;
use Elementor\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Go_Pro_Promotion_Item implements Admin_Menu_Item_With_Page {
	private static string $url = 'https://go.elementor.com/pro-admin-menu/';

	public function get_name() {
		return 'admin_menu_promo';
	}

	public function is_visible() {
		return true;
	}

	public function get_parent_slug() {
		return Settings::PAGE_ID;
	}

	public function get_label() {
		$upgrade_text = __( 'Upgrade', 'elementor' );
		$promotion['upgrade_text'] = $upgrade_text;
		return apply_filters( 'elementor/admin_menu_promo/restrictions/custom_promotion', $promotion )['upgrade_text'] ?? $upgrade_text;
	}

	public function get_page_title() {
		return esc_html__( 'Upgrade', 'elementor' );
	}

	public function get_capability() {
		return 'manage_options';
	}

	public static function get_url() {
		return esc_url( self::$url );
	}

	public function render() {
		// Redirects from the module on `admin_init`.
		die;
	}
}
