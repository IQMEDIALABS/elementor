<?php
namespace Elementor\Core\Common\Modules\Finder\Categories;

use Elementor\Core\Common\Modules\Finder\Base_Category;
use Elementor\Core\RoleManager\Role_Manager;
use Elementor\TemplateLibrary\Source_Local;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Site Category
 *
 * Provides general site items.
 */
class Site extends Base_Category {

	/**
	 * Get title.
	 *
	 * @access public
	 *
	 * @return string
	 */
	public function get_title() {
		return __( 'Site', 'elementor' );
	}

	/**
	 * Get category items.
	 *
	 * @access public
	 *
	 * @param array $options
	 *
	 * @return array
	 */
	public function get_category_items( array $options = [] ) {
		return [
			'homepage' => [
				'title' => __( 'Homepage', 'elementor' ),
				'url' => home_url(),
				'icon' => 'home-heart',
				'keywords' => [ 'home', 'page' ],
			],
			'wordpress-dashboard' => [
				'title' => __( 'Dashboard', 'elementor' ),
				'icon' => 'dashboard',
				'url' => admin_url(),
				'keywords' => [ 'dashboard', 'wordpress' ],
			],
			'wordpress-menus' => [
				'title' => __( 'Menus', 'elementor' ),
				'icon' => 'wordpress',
				'url' => admin_url( 'nav-menus.php' ),
				'keywords' => [ 'menu', 'wordpress' ],
			],
			'wordpress-customizer' => [
				'title' => __( 'Customizer', 'elementor' ),
				'icon' => 'wordpress',
				'url' => admin_url( 'customize.php' ),
				'keywords' => [ 'customizer', 'wordpress' ],
			],
		];
	}
}
