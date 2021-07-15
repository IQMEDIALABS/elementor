<?php
namespace Elementor\Data\TemplateLibrary\Endpoints;

use Elementor\Data\Base\Endpoint;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Templates extends Endpoint {
	public function get_name() {
		return 'templates';
	}

	public function get_items( $request ) {
		return Plugin::$instance->templates_manager->get_library_data( [ 'only_sources', $request->get_param( 'source' ) ] );
	}

}
