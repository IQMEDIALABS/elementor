<?php
namespace Elementor\App\Modules\KitLibrary\Connect;

use Elementor\Core\Common\Modules\Connect\Apps\Base_App;
use Elementor\Core\Common\Modules\Connect\Apps\Library;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Kit_Library extends Library {
	const DEFAULT_BASE_ENDPOINT = 'https://my.elementor.com/api/v1/kits-library';
	const FALLBACK_BASE_ENDPOINT = 'https://ms-8874.elementor.com/api/v1/kits-library';

	public function get_title() {
		return __( 'Kit Library', 'elementor' );
	}

	public function get_all() {
		return $this->http_request( 'GET', 'kits' );
	}

	public function get_taxonomies() {
		return $this->http_request( 'GET', 'taxonomies' );
	}

	public function get_manifest( $id ) {
		return $this->http_request( 'GET', "kits/{$id}/manifest" );
	}

	public function download_link( $id ) {
		return $this->http_request( 'GET', "kits/{$id}/download-link" );
	}

	protected function get_api_url() {
		return [
			static::DEFAULT_BASE_ENDPOINT,
			static::FALLBACK_BASE_ENDPOINT,
		];
	}

	protected function init() {
		// Remove parent init actions.
	}

	/**
	 * Get all the connect information
	 *
	 * @return array
	 */
	protected function get_connect_info() {
		$connect_info = [
			'app' => $this->get_slug(),
			'access_token' => $this->get( 'access_token' ),
			'client_id' => $this->get( 'client_id' ),
			'local_id' => get_current_user_id(),
			'site_key' => $this->get_site_key(),
			'home_url' => trailingslashit( home_url() ),
		];

		$additional_info = [];

		// BC Support.
		$old_kit_library = new \Elementor\Core\App\Modules\KitLibrary\Connect\Kit_Library();

		/**
		 * Additional connect info.
		 *
		 * Filters the connection information when connecting to Elementor servers.
		 * This hook can be used to add more information or add more data.
		 *
		 * @param array    $additional_info Additional connecting information array.
		 * @param Base_App $this            The base app instance.
		 */
		$additional_info = apply_filters( 'elementor/connect/additional-connect-info', $additional_info, $old_kit_library );

		return array_merge( $connect_info, $additional_info );
	}
}
