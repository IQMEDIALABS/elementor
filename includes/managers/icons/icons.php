<?php
namespace Elementor;

use Elementor\Core\Files\File_Types\Svg;
use Elementor\Core\Page_Assets\Data_Managers\Font_Icon_Svg\Manager as Font_Icon_Svg_Data_Manager;
use Elementor\Icons_Manager\Migrations;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor icons manager.
 *
 * Elementor icons manager handler class
 *
 * @since 2.4.0
 */
class Icons_Manager {

	const FONT_ICON_SVG_CLASS_NAME = 'e-font-icon-svg';

	const LOAD_FA4_SHIM_OPTION_KEY = 'elementor_load_fa4_shim';

	const ELEMENTOR_ICONS_VERSION = '5.3';

	const CURRENT_FONTAWESOME_VERSION = '6.5.1';

	/**
	 * Tabs.
	 *
	 * Holds the list of all the tabs.
	 *
	 * @access private
	 * @static
	 * @since 2.4.0
	 * @var array
	 */
	private static $tabs;

	private static $data_manager;

	/**
	 * @param $icon
	 * @param $attributes
	 * @param $tag
	 * @return bool|mixed|string
	 */
	public static function try_get_icon_html( $icon, $attributes = [], $tag = 'i' ) {
		if ( empty( $icon['library'] ) ) {
			return '';
		}

		return static::get_icon_html( $icon, $attributes, $tag );
	}

	/**
	 * @param array $icon
	 * @param array $attributes
	 * @param $tag
	 * @return bool|mixed|string
	 */
	private static function get_icon_html( array $icon, array $attributes, $tag ) {
		/**
		 * When the library value is svg it means that it's a SVG media attachment uploaded by the user.
		 * Otherwise, it's the name of the font family that the icon belongs to.
		 */
		if ( 'svg' === $icon['library'] ) {
			$output = self::render_uploaded_svg_icon( $icon['value'] );
		} else {
			$output = self::render_font_icon( $icon, $attributes, $tag );
		}
		return $output;
	}

	/**
	 * register styles
	 *
	 * Used to register all icon types stylesheets so they could be enqueued later by widgets
	 */
	public function register_styles() {
		$config = self::get_icon_manager_tabs_config();

		$shared_styles = [];

		foreach ( $config as $type => $icon_type ) {
			if ( ! isset( $icon_type['url'] ) ) {
				continue;
			}
			$dependencies = [];
			if ( ! empty( $icon_type['enqueue'] ) ) {
				foreach ( (array) $icon_type['enqueue'] as $font_css_url ) {
					if ( ! in_array( $font_css_url, array_keys( $shared_styles ), true ) ) {
						$style_handle = 'elementor-icons-shared-' . count( $shared_styles );
						wp_register_style(
							$style_handle,
							$font_css_url,
							[],
							$icon_type['ver']
						);
						$shared_styles[ $font_css_url ] = $style_handle;
					}
					$dependencies[] = $shared_styles[ $font_css_url ];
				}
			}
			wp_register_style(
				'elementor-icons-' . $icon_type['name'],
				$icon_type['url'],
				$dependencies,
				$icon_type['ver']
			);
		}
	}

	/**
	 * Init Tabs
	 *
	 * Initiate Icon Manager Tabs.
	 *
	 * @access private
	 * @static
	 * @since 2.4.0
	 */
	private static function init_tabs() {
		$initial_tabs = [
			'fa-regular' => [
				'name' => 'fa-regular',
				'label' => esc_html__( 'Font Awesome - Regular', 'elementor' ),
				'url' => self::get_fa_asset_url( 'regular' ),
				'enqueue' => [ self::get_fa_asset_url( 'fontawesome' ) ],
				'prefix' => 'fa-',
				'displayPrefix' => 'far',
				'labelIcon' => 'fab fa-font-awesome-alt fa-square-font-awesome-stroke',
				'ver' => self::CURRENT_FONTAWESOME_VERSION,
				'fetchJson' => self::get_fa_asset_url( 'regular', 'js', false ),
				'native' => true,
			],
			'fa-solid' => [
				'name' => 'fa-solid',
				'label' => esc_html__( 'Font Awesome - Solid', 'elementor' ),
				'url' => self::get_fa_asset_url( 'solid' ),
				'enqueue' => [ self::get_fa_asset_url( 'fontawesome' ) ],
				'prefix' => 'fa-',
				'displayPrefix' => 'fas',
				'labelIcon' => 'fab fa-font-awesome',
				'ver' => self::CURRENT_FONTAWESOME_VERSION,
				'fetchJson' => self::get_fa_asset_url( 'solid', 'js', false ),
				'native' => true,
			],
			'fa-brands' => [
				'name' => 'fa-brands',
				'label' => esc_html__( 'Font Awesome - Brands', 'elementor' ),
				'url' => self::get_fa_asset_url( 'brands' ),
				'enqueue' => [ self::get_fa_asset_url( 'fontawesome' ) ],
				'prefix' => 'fa-',
				'displayPrefix' => 'fab',
				'labelIcon' => 'fab fa-font-awesome-flag fa-flag',
				'ver' => self::CURRENT_FONTAWESOME_VERSION,
				'fetchJson' => self::get_fa_asset_url( 'brands', 'js', false ),
				'native' => true,
			],
		];

		/**
		 * Initial icon manager tabs.
		 *
		 * Filters the list of initial icon manager tabs.
		 *
		 * @param array $icon_manager_tabs Initial icon manager tabs.
		 */
		$initial_tabs = apply_filters( 'elementor/icons_manager/native', $initial_tabs );

		self::$tabs = $initial_tabs;
	}

	/**
	 * Get Icon Manager Tabs
	 * @return array
	 */
	public static function get_icon_manager_tabs() {
		if ( self::is_font_icon_inline_svg() && ! Plugin::$instance->editor->is_edit_mode() && ! Plugin::$instance->preview->is_preview_mode() ) {
			self::$tabs = [];
		} elseif ( ! self::$tabs ) {
			self::init_tabs();
		}

		$additional_tabs = [];

		/**
		 * Additional icon manager tabs.
		 *
		 * Filters additional icon manager tabs.
		 *
		 * @param array $additional_tabs Additional icon manager tabs. Default is an empty array.
		 */
		$additional_tabs = apply_filters( 'elementor/icons_manager/additional_tabs', $additional_tabs );

		return array_replace( self::$tabs, $additional_tabs );
	}

	public static function enqueue_shim() {
		//phpcs:ignore WordPress.WP.EnqueuedResourceParameters.NotInFooter
		wp_enqueue_script(
			'font-awesome-4-shim',
			self::get_fa_asset_url( 'v4-shims', 'js' ),
			[],
			ELEMENTOR_VERSION
		);
		// Make sure that the CSS in the 'all' file does not override FA Pro's CSS
		if ( ! wp_script_is( 'font-awesome-pro' ) ) {
			wp_enqueue_style(
				'font-awesome-all',
				self::get_fa_asset_url( 'all' ),
				[],
				ELEMENTOR_VERSION
			);
		}
		wp_enqueue_style(
			'font-awesome-4-shim',
			self::get_fa_asset_url( 'v4-shims' ),
			[],
			ELEMENTOR_VERSION
		);
	}

	public static function get_fa_asset_url( $filename, $ext_type = 'css', $add_suffix = true ) {
		$url = ELEMENTOR_ASSETS_URL . 'lib/font-awesome/' . $ext_type . '/v' . self::get_fa_version_to_load() . '/' . $filename;

		$script_debug = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;
		$test_mode = defined( 'ELEMENTOR_TESTS' ) && ELEMENTOR_TESTS;

		if ( ! $script_debug && ! $test_mode && $add_suffix ) {
			$url .= '.min';
		}

		return $url . '.' . $ext_type;
	}

	public static function get_icon_manager_tabs_config() {
		$tabs = [
			'all' => [
				'name' => 'all',
				'label' => esc_html__( 'All Icons', 'elementor' ),
				'labelIcon' => 'eicon-filter',
				'native' => true,
			],
		];

		return array_values( array_merge( $tabs, self::get_icon_manager_tabs() ) );
	}

	/**
	 * is_font_awesome_inline
	 *
	 * @return bool
	 */
	private static function is_font_icon_inline_svg() {
		return Plugin::$instance->experiments->is_feature_active( 'e_font_icon_svg' );
	}

	/**
	 * @deprecated 3.8.0
	 */
	public static function render_svg_symbols() {}

	public static function get_icon_svg_data( $icon ) {
		return self::$data_manager->get_font_icon_svg_data( $icon );
	}

	/**
	 * Get font awesome svg.
	 * @param $icon array [ 'value' => string, 'library' => string ]
	 *
	 * @return bool|mixed|string
	 */
	public static function get_font_icon_svg( $icon, $attributes = [] ) {
		// Load the SVG from the database.
		$icon_data = self::get_icon_svg_data( $icon );

		if ( ! $icon_data['path'] ) {
			return '';
		}

		if ( ! empty( $attributes['class'] ) && ! is_array( $attributes['class'] ) ) {
			$attributes['class'] = [ $attributes['class'] ];
		}

		$attributes['class'][] = self::FONT_ICON_SVG_CLASS_NAME;
		$attributes['class'][] = 'e-' . $icon_data['key'];
		$attributes['viewBox'] = '0 0 ' . $icon_data['width'] . ' ' . $icon_data['height'];
		$attributes['xmlns'] = 'http://www.w3.org/2000/svg';

		return (
			'<svg ' . Utils::render_html_attributes( $attributes ) . '>' .
				'<path d="' . esc_attr( $icon_data['path'] ) . '"></path>' .
			'</svg>'
		);
	}

	public static function render_uploaded_svg_icon( $value ) {
		if ( ! isset( $value['id'] ) ) {
			return '';
		}

		return Svg::get_inline_svg( $value['id'] );
	}

	public static function render_font_icon( $icon, $attributes = [], $tag = 'i' ) {
		$icon_types = self::get_icon_manager_tabs();

		if ( isset( $icon_types[ $icon['library'] ]['render_callback'] ) && is_callable( $icon_types[ $icon['library'] ]['render_callback'] ) ) {
			return call_user_func_array( $icon_types[ $icon['library'] ]['render_callback'], [ $icon, $attributes, $tag ] );
		}

		$content = '';

		$font_icon_svg_family = self::is_font_icon_inline_svg() ? Font_Icon_Svg_Data_Manager::get_font_family( $icon['library'] ) : '';

		if ( $font_icon_svg_family ) {
			$icon['font_family'] = $font_icon_svg_family;

			$content = self::get_font_icon_svg( $icon, $attributes );

			if ( $content ) {
				return $content;
			}
		}

		if ( ! $content ) {
			if ( empty( $attributes['class'] ) ) {
				$attributes['class'] = $icon['value'];
			} else {
				if ( is_array( $attributes['class'] ) ) {
					$attributes['class'][] = $icon['value'];
				} else {
					$attributes['class'] .= ' ' . $icon['value'];
				}
			}
		}

		return '<' . $tag . ' ' . Utils::render_html_attributes( $attributes ) . '>' . $content . '</' . $tag . '>';
	}

	/**
	 * Render Icon
	 *
	 * Used to render Icon for \Elementor\Controls_Manager::ICONS
	 * @param array $icon             Icon Type, Icon value
	 * @param array $attributes       Icon HTML Attributes
	 * @param string $tag             Icon HTML tag, defaults to <i>
	 *
	 * @return mixed|string
	 */
	public static function render_icon( $icon, $attributes = [], $tag = 'i' ) {
		if ( empty( $icon['library'] ) ) {
			return false;
		}

		$output = static::get_icon_html( $icon, $attributes, $tag );

		Utils::print_unescaped_internal_string( $output );

		return true;
	}

	/**
	 * Get the current Font Awesome major version.
	 *
	 * @return int
	 */
	public static function get_current_fa_version() {
		return (int) explode( '.', self::CURRENT_FONTAWESOME_VERSION )[0];
	}

	/**
	 * Get the number of the Font Awesome version to load.
	 * If migration is required, it will return the older version.
	 *
	 * @return int
	 */
	public static function get_fa_version_to_load() {
		return Migrations::is_migration_required()
			? self::get_current_fa_version() - 1
			: self::get_current_fa_version();
	}

	/**
	 * on_import_migration
	 *
	 * @deprecated 3.19.0 Use 'Migrations::on_import_migration' method instead.
	 *
	 * @param array $element        settings array
	 * @param string $old_control   old control id
	 * @param string $new_control   new control id
	 * @param bool $remove_old      boolean weather to remove old control or not
	 *
	 * @return array
	 */
	public static function on_import_migration( array $element, $old_control = '', $new_control = '', $remove_old = false ) {
		return Migrations::on_import_migration( $element, $old_control, $new_control, $remove_old );
	}

	/**
	 * is_migration_allowed
	 * @deprecated 3.19.0 Use 'Migrations::is_migration_required' method instead.
	 * @return bool
	 */
	public static function is_migration_allowed() {
		static $migration_allowed = false;
		if ( false === $migration_allowed ) {
			$migration_allowed = null === Migrations::get_needs_upgrade_option();

			/**
			 * Is icon migration allowed.
			 *
			 * Filters whether the icons migration allowed.
			 * @deprecated 3.19.0 Use `elementor/icons_manager/migration_required` hook Instead.
			 *
			 * @param bool $migration_allowed Is icon migration is allowed.
			 */
			$migration_allowed = apply_filters( 'elementor/icons_manager/migration_allowed', $migration_allowed );
		}
		return $migration_allowed;
	}

	/**
	 * Register_Admin Settings
	 *
	 * adds Font Awesome migration / update admin settings
	 * @param Settings $settings
	 */
	public function register_admin_settings( Settings $settings ) {
		$settings->add_field(
			Settings::TAB_ADVANCED,
			Settings::TAB_ADVANCED,
			'load_fa4_shim',
			[
				'label' => esc_html__( 'Load Font Awesome 4 Support', 'elementor' ),
				'field_args' => [
					'type' => 'select',
					'std' => '',
					'options' => [
						'' => esc_html__( 'No', 'elementor' ),
						'yes' => esc_html__( 'Yes', 'elementor' ),
					],
					'desc' => esc_html__( 'Font Awesome 4 support script (shim.js) is a script that makes sure all previously selected Font Awesome 4 icons are displayed correctly while using later Font Awesome versions.', 'elementor' ),
				],
			]
		);
	}

	public static function enqueue_fa_legacy_css() {
		if ( Migrations::is_migration_required() ) {
			wp_enqueue_style( 'fontawesome4' );
			wp_enqueue_style( 'fontawesome5' );
		} else {
			$current_filter = current_filter();
			$load_shim = get_option( self::LOAD_FA4_SHIM_OPTION_KEY, false );
			if ( 'elementor/editor/after_enqueue_styles' === $current_filter ) {
				self::enqueue_shim();
			} elseif ( 'yes' === $load_shim ) {
				self::enqueue_shim();
			}
		}
	}

	/**
	 * @deprecated 3.1.0
	 */
	public function add_admin_strings() {
		Plugin::$instance->modules_manager->get_modules( 'dev-tools' )->deprecation->deprecated_function( __METHOD__, '3.1.0' );

		return [];
	}

	/**
	 * Add settings
	 *
	 * @param array $settings
	 *
	 * @return array
	 */
	public function add_settings( $settings ) {
		$settings['icons']['current_fa_version'] = self::get_current_fa_version();

		return $settings;
	}

	/**
	 * Icons Manager constructor
	 */
	public function __construct() {
		if ( is_admin() ) {
			// @todo: remove once we deprecate fa4
			add_action( 'elementor/admin/after_create_settings/' . Settings::PAGE_ID, [ $this, 'register_admin_settings' ], 100 );
		}

		if ( self::is_font_icon_inline_svg() ) {
			self::$data_manager = new Font_Icon_Svg_Data_Manager();
		}

		add_filter( 'elementor/editor/localize_settings', [ $this, 'add_settings' ] );
		add_action( 'elementor/frontend/after_enqueue_styles', [ $this, 'enqueue_fa_legacy_css' ] );
		add_action( 'elementor/frontend/after_register_styles', [ $this, 'register_styles' ] );
	}
}
