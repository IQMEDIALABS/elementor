<?php

namespace Elementor\Core\Common\Modules\Finder;

use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Categories_Manager {

	/**
	 * @access private
	 *
	 * @var Base_Category[]
	 */
	private $categories;

	/**
	 * @var array
	 */
	private $categories_list = [
		'edit',
		'general',
		'create',
		'site',
		'settings',
		'tools',
	];

	/**
	 * Add category.
	 *
	 * @since 2.3.0
	 * @access public
	 * @param string        $category_name
	 * @param Base_Category $category
	 *
	 * @deprecated 3.5.0 Use `$this->register()` instead.
	 */
	public function add_category( $category_name, Base_Category $category ) {
		Plugin::$instance->modules_manager->get_modules( 'dev-tools' )->deprecation->deprecated_function(
			__METHOD__,
			'3.5.0',
			'register'
		);

		$this->register( $category, $category_name );
	}

	/**
	 * Register a finder category.
	 *
	 * @param Base_Category $finder_category_instance An Instance of a category.
	 * @param string        $finder_category_name     A Category name. Deprecated parameter.
	 *
	 * @return void
	 * @since 3.5.0
	 * @access public
	 */
	public function register( Base_Category $finder_category_instance, $finder_category_name = null ) {
		// TODO: For BC. Remove in the future.
		if ( ! $finder_category_name ) {
			$finder_category_name = $finder_category_instance->get_id();
		}

		$this->categories[ $finder_category_name ] = $finder_category_instance;
	}

	/**
	 * Get categories.
	 *
	 * @since 2.3.0
	 * @access public
	 * @param string $category
	 *
	 * @return Base_Category|Base_Category[]|null
	 */
	public function get_categories( $category = '' ) {
		if ( ! $this->categories ) {
			$this->init_categories();
		}

		if ( $category ) {
			if ( isset( $this->categories[ $category ] ) ) {
				return $this->categories[ $category ];
			}

			return null;
		}

		return $this->categories;
	}

	/**
	 * Init categories.
	 *
	 * Used to initialize finder default categories.
	 * @since 2.3.0
	 * @access private
	 */
	private function init_categories() {
		foreach ( $this->categories_list as $category_name ) {
			$class_name = __NAMESPACE__ . '\Categories\\' . $category_name;

			$this->register( new $class_name() );
		}

		/**
		 * Elementor Finder categories init.
		 *
		 * Fires after Elementor Finder initialize it's native categories.
		 *
		 * This hook should be used to add your own Finder categories.
		 *
		 * @since 2.3.0
		 * @deprecated 3.5.0 Use `elementor/finder/categories/register` hook instead.
		 *
		 * @param Categories_Manager $this.
		 */
		Plugin::$instance->modules_manager->get_modules( 'dev-tools' )->deprecation->do_deprecated_action(
			'elementor/finder/categories/init',
			[ $this ],
			'3.5.0',
			'elementor/finder/categories/register'
		);

		/**
		 * Elementor Finder categories init.
		 *
		 * Fires after Elementor Finder initialize it's native categories.
		 *
		 * This hook should be used to add your own Finder categories.
		 *
		 * @since 3.5.0
		 *
		 * @param Categories_Manager $this Finder Categories manager.
		 */
		do_action( 'elementor/finder/categories/register', $this );
	}
}
