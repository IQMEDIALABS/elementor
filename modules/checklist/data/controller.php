<?php
namespace Elementor\Modules\Checklist\Data;

use Elementor\Data\V2\Base\Controller as Controller_Base;
use Elementor\Modules\Checklist\Data\Endpoints\Steps;
use Elementor\Modules\Checklist\Data\Endpoints\User_Progress;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Controller extends Controller_Base {
	public function get_name() {
		return 'checklist';
	}

	public function register_endpoints() {
		$this->register_endpoint( new Steps( $this ) );
		$this->register_endpoint( new User_Progress( $this ) );
	}

	// Bypass, currently not required.
	protected function register_index_endpoint() {}

	public function create_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function create_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function get_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}
}
