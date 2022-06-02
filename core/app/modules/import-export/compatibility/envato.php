<?php

namespace Elementor\Core\App\Modules\ImportExport\Compatibility;

use Elementor\Core\App\Modules\ImportExport\Utils as ImportExportUtils;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Envato extends Base_Adapter {
	public static function is_compatibility_needed( array $manifest_data, array $meta ) {
		return ! empty( $manifest_data['manifest_version'] );
	}

	public function adapt_manifest( array $manifest_data ) {
		$templates = $manifest_data['templates'];

		$manifest_data['templates'] = [];

		foreach ( $templates as $template ) {
			// Envato store their global kit styles as a 'global.json' template file, this needs to be converted to 'site-settings.json' file
			$is_global = ! empty( $template['metadata']['template_type'] ) && 'global-styles' === $template['metadata']['template_type'];
			if ( $is_global ) {
				// Adding the path of the template that Envato using for storing the site settings.
				$manifest_data['envato-template-site-settings'] = $template['source'];

				// Getting the site-settings because Envato stores them in one of the posts.
				$kit = Plugin::$instance->kits_manager->get_active_kit();
				$kit_tabs = $kit->get_tabs();
				unset( $kit_tabs['settings-site-identity'] );
				$manifest_data['site-settings'] = array_keys( $kit_tabs );

				continue;
			}

			// Evanto uses "type" instead of "doc_type"
			$template['doc_type'] = $template['type'];

			// Evanto uses for "name" instead of "title"
			$template['title'] = $template['name'];
			// Envato specifying an exact path to the template rather than using its "ID" as an index.
			// This extracts the "file name" part out of our exact source list and we treat that as an ID.
			$file_name_without_extension = str_replace( '.json', '', basename( $template['source'] ) );

			// Append the template to the global list:
			$manifest_data['templates'][ $file_name_without_extension ] = $template;
		}

		return $manifest_data;
	}

	public function adapt_site_settings( array $site_settings, array $manifest_data, $path ) {
		if ( empty( $manifest_data['envato-template-site-settings'] ) ) {
			return $site_settings;
		}

		$global_file_data = ImportExportUtils::read_json_file( $path . str_replace( '.json', '', $manifest_data['envato-template-site-settings'] ) );

		return [ 'settings' => $global_file_data['page_settings'] ];
	}

	public function adapt_template( array $template_data, array $template_settings ) {
		if ( ! empty( $template_data['metadata']['elementor_pro_conditions'] ) ) {
			foreach ( $template_data['metadata']['elementor_pro_conditions'] as $condition ) {
				list ( $type, $name, $sub_name, $sub_id ) = array_pad( explode( '/', $condition ), 4, '' );

				$template_data['import_settings']['conditions'][] = compact( 'type', 'name', 'sub_name', 'sub_id' );
			}
		}

		return $template_data;
	}
}
