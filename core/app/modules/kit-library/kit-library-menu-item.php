<?php
namespace Elementor\Core\App\Modules\KitLibrary;

use Elementor\Core\Admin\Menu\Interfaces\Admin_Menu_Item;
use Elementor\TemplateLibrary\Source_Local;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Kit_Library_Menu_Item implements Admin_Menu_Item {

	public function is_visible() {
		return true;
	}

	public function parent_slug() {
		return Source_Local::ADMIN_MENU_SLUG;
	}

	public function label() {
		return esc_html__( 'Kit Library', 'elementor' );
	}

	public function page_title() {
		return esc_html__( 'Kit Library', 'elementor' );
	}

	public function position() {
		return 1;
	}

	public function capability() {
		return 'manage_options';
	}
}
