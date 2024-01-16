<?php
namespace Elementor\Core\Page_Assets\Data_Managers\Font_Icon_Svg;

use Elementor\Icons_Manager;
use Elementor\Icons_Manager\Migrations as Icons_Migrations;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Font Awesome Icon Svg.
 *
 * @since 3.4.0
 */
class Font_Awesome extends Base {
	const LIBRARY_CURRENT_VERSION = '6.5.1';

	protected function get_config( $icon ) {
		preg_match( '/fa(.*) fa-/', $icon['value'], $icon_name_matches );

		$icon_name = str_replace( $icon_name_matches[0], '', $icon['value'] );

		$icon_key = str_replace( ' fa-', '-', $icon['value'] );

		$icon_file_name = str_replace( 'fa-', '', $icon['library'] );

		$fa_version = Icons_Migrations::is_migration_required()
			? Icons_Manager::get_current_fa_version() - 1
			: Icons_Manager::get_current_fa_version();

		return [
			'key' => $icon_key,
			'version' => self::LIBRARY_CURRENT_VERSION,
			'file_path' => ELEMENTOR_ASSETS_PATH . 'lib/font-awesome/json/v' . $fa_version . '/' . $icon_file_name . '.json',
			'data' => [
				'icon_data' => [
					'name' => $icon_name,
					'library' => $icon['library'],
				],
			],
		];
	}

	protected function get_asset_content() {
		$icon_data = $this->get_config_data( 'icon_data' );

		$file_data = json_decode( $this->get_file_data( 'content', $icon_data['library'] ), true );

		$icon_name = $icon_data['name'];

		if ( ! empty( $file_data['icons'][ $icon_name ] ) ) {
			$svg_data = $file_data['icons'][ $icon_name ];
		}

		return [
			'width' => $svg_data[0] ?? '',
			'height' => $svg_data[1] ?? '',
			'path' => $svg_data[4] ?? '',
			'key' => $this->get_key(),
		];
	}
}
