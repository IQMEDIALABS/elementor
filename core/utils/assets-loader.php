<?php
namespace Elementor\Core\Utils;

use Elementor\Core\Base\Module;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Elementor assets loader.
 *
 * A class that is responsible for conditionally enqueuing styles and script assets that were pre-enabled.
 *
 * @since 3.1.0
 */
class Assets_Loader extends Module {
	private $assets;

	public function get_name() {
		return 'assets-loader';
	}

	private function init_assets() {
		$this->assets = [
			'styles' => [
				'e-animations' => [
					'src' => $this->get_css_assets_url( 'animations', 'assets/lib/animations/', true ),
					'version' => ELEMENTOR_VERSION,
					'dependencies' => [],
				],
			],
			'scripts' => [],
		];
	}

	private function get_assets() {
		if ( ! $this->assets ) {
			$this->init_assets();
		}

		return $this->assets;
	}

	public function enable_asset( $asset_type, $asset_name ) {
		if ( ! $this->assets ) {
			$this->init_assets();
		}

		$this->assets[ $asset_type ][ $asset_name ]['enabled'] = true;
	}

	public function add_assets( $assets ) {
		if ( ! $this->assets ) {
			$this->init_assets();
		}

		$this->assets = array_replace_recursive( $this->assets, $assets );
	}

	public function enqueue_assets() {
		$assets = $this->get_assets();

		foreach ( $assets as $assets_type => $assets_type_data ) {
			foreach ( $assets_type_data as $asset_name => $asset_data ) {
				if ( ! empty( $asset_data['enabled'] ) || Plugin::$instance->editor->is_edit_mode() ) {
					if ( 'scripts' === $assets_type ) {
						wp_enqueue_script( $asset_name, $asset_data['src'], $asset_data['dependencies'], $asset_data['version'], true );
					} else {
						wp_enqueue_style( $asset_name, $asset_data['src'], $asset_data['dependencies'], $asset_data['version'] );
					}
				}
			}
		}
	}
}
