<?php
namespace Elementor\Modules\Checklist\Data;

use Elementor\Data\Base\Controller as Controller_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Controller extends Controller_Base {
	public function get_name() {
		return 'checklist';
	}

	protected function register_endpoints() {
		$this->register_endpoint( Endpoints\Refresh_Checklist::class );
	}
}
