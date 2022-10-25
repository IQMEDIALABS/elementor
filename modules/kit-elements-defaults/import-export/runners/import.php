<?php
namespace Elementor\Modules\KitElementsDefaults\ImportExport\Runners;

use Elementor\Plugin;
use Elementor\Core\Utils\Collection;
use Elementor\Modules\KitElementsDefaults\Module;
use Elementor\App\Modules\ImportExport\Utils as ImportExportUtils;
use Elementor\Modules\KitElementsDefaults\Utils\Settings_Sanitizer;
use Elementor\App\Modules\ImportExport\Runners\Import\Import_Runner_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Import extends Import_Runner_Base {
	public static function get_name() : string {
		return 'elements-default-values';
	}

	public function should_import( array $data ) {
		// Together with site-settings.
		return (
			isset( $data['include'] ) &&
			in_array( 'settings', $data['include'], true ) &&
			! empty( $data['site_settings']['settings'] ) &&
			! empty( $data['extracted_directory_path'] )
		);
	}

	public function import( array $data, array $imported_data ) {
		$kit = Plugin::$instance->kits_manager->get_active_kit();

		$default_values = ImportExportUtils::read_json_file( $data['extracted_directory_path'] . '/kit-elements-defaults.json' );

		if ( ! $kit || ! $default_values ) {
			return [];
		}

		$sanitizer = new Settings_Sanitizer(
			Plugin::$instance->elements_manager,
			array_keys( Plugin::$instance->widgets_manager->get_widget_types() )
		);

		$default_values = ( new Collection( $default_values ) )
			->map(function ( $settings, $type ) use ( $sanitizer, $kit ) {
				return $sanitizer
					->for( $type, $settings )
					->remove_unsupported_keys()
					->prepare_for_import( $kit )
					->get();
			})
			->all();

		$kit->update_json_meta( Module::META_KEY, $default_values );

		return $default_values;
	}
}
