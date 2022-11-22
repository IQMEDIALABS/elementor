<?php
namespace Elementor\App\Services\License;

use Elementor\App\Services\Base_Service;

class License_Service extends Base_Service {

	public function get_name() : string {
		return 'license';
	}

	public function register() : License_Service {
		return $this;
	}

	public function is_valid() : bool {
		return true;
	}
}
