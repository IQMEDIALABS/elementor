<?php
namespace Elementor\Data\Base;

use Elementor\Data\Base\Endpoint\Index\SubIndexEndpoint;
use Elementor\Data\Manager;

/**
 * Class SubController, main advantages:
 * get_route, route extending.
 * get_parent_name, simple way to extend/attach on parent controller.
 * does not require use of endpoints.
 */
abstract class SubController extends Controller {
	/**
	 * @var \Elementor\Data\Base\Controller
	 */
	public $parent_controller;

	public function __construct() {
		$parent_controller_name = $this->get_parent_name();

		if ( $parent_controller_name ) {
			$this->parent_controller = Manager::instance()->get_controller( $parent_controller_name );
		}

		if ( ! $this->parent_controller ) {
			trigger_error( "Cannot find parent controller: '$parent_controller_name'" );
			return;
		}

		parent::__construct();
	}

	/**
	 * Get parent controller name.
	 *
	 * @return string
	 */
	abstract public function get_parent_name();

	/**
	 * Current route, always should start with '/' and end with '/'.
	 *
	 * @return string
	 */
	abstract public function get_route();

	public function get_full_name() {
		return $this->parent_controller->get_name() . '/' . parent::get_full_name();
	}

	public function get_base_route() {
		return $this->parent_controller->get_base_route() . $this->get_route() . $this->get_name();
	}

	public function get_parent() {
		return $this->parent_controller;
	}

	protected function register_index_endpoint() {
		$this->register_endpoint( new SubIndexEndpoint( $this ) );
	}
}
