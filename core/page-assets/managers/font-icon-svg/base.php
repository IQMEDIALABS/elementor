<?php
namespace Elementor\Core\Page_Assets\Managers\Font_Icon_Svg;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor Font Icon Svg.
 *
 * @since 3.3.0
 */
abstract class Base {
	protected static $icon;

	abstract protected static function get_font_name();

	abstract protected static function get_config_key();

	abstract protected static function get_config_version();

	abstract protected static function get_config_file_path();

	protected static function get_config_data() {
		return [];
	}

	public static function get_config( $icon ) {
		self::$icon = $icon;


		return [
			'key' => static::get_config_key(),
			'version' => static::get_config_version(),
			'file_path' => static::get_config_file_path(),
			'data' => static::get_config_data(),
		];
	}

	public static function get_icon_svg_data( $icon ) {
		return Plugin::$instance->assets_loader->get_asset_inline_content( self::get_icon_svg_config( $icon ) );
	}
}
