<?php
namespace Elementor\Data\Base\Endpoint;

use Elementor\Data\Base\Endpoint;
use WP_REST_Server;

class Index extends Endpoint {
	public $id_arg_name = 'id';

	public function get_name() {
		return 'index';
	}

	public function get_format() {
		return "{$this->controller->get_full_name()}/{id}";
	}

	public function get_public_name() {
		return '';
	}

	public function get_items( $request ) {
		return $this->controller->get_items( $request );
	}

	public function register_item_route( $methods = WP_REST_Server::READABLE, $args = [], $route = '/' ) {
		// Save 'id_arg_name' for 'sub controller, index endpoint'.
		if ( ! empty( $args['id_arg_name'] ) && 'id' === $this->id_arg_name ) {
			$this->id_arg_name = $args['id_arg_name'];
		}

		parent::register_item_route( $methods, $args, $route );
	}
}
