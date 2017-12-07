<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Rollback.
 *
 * Elementor rollback handler class.
 *
 * @since 1.5.0
 */
class Rollback {

	protected $package_url;
	protected $version;
	protected $plugin_name;
	protected $plugin_slug;

	/**
	 * @since 1.5.0
	 * @access public
	*/
	public function __construct( $args = [] ) {
		foreach ( $args as $key => $value ) {
			$this->{$key} = $value;
		}
	}

	/**
	 * @since 1.5.0
	 * @access private
	*/
	private function print_inline_style() {
		?>
		<style>
			.wrap {
				overflow: hidden;
			}

			h1 {
				background: #9b0a46;
				text-align: center;
				color: #fff !important;
				padding: 70px !important;
				text-transform: uppercase;
				letter-spacing: 1px;
			}

			h1 img {
				max-width: 300px;
				display: block;
				margin: auto auto 50px;
			}
		</style>
		<?php
	}

	/**
	 * @since 1.5.0
	 * @access protected
	*/
	protected function apply_package() {
		$update_plugins = get_site_transient( 'update_plugins' );
		if ( ! is_object( $update_plugins ) ) {
			$update_plugins = new \stdClass();
		}

		$plugin_info = new \stdClass();
		$plugin_info->new_version = $this->version;
		$plugin_info->slug = $this->plugin_slug;
		$plugin_info->package = $this->package_url;
		$plugin_info->url = 'https://elementor.com/';

		$update_plugins->response[ $this->plugin_name ] = $plugin_info;

		// Remove handle beta testers.
		remove_filter( 'pre_set_site_transient_update_plugins', [ Plugin::instance()->beta_testers, 'check_version' ] );

		set_site_transient( 'update_plugins', $update_plugins );
	}

	/**
	 * @since 1.5.0
	 * @access protected
	*/
	protected function upgrade() {
		require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

		$logo_url = ELEMENTOR_ASSETS_URL . 'images/logo-panel.svg';

		$upgrader_args = [
			'url' => 'update.php?action=upgrade-plugin&plugin=' . urlencode( $this->plugin_name ),
			'plugin' => $this->plugin_name,
			'nonce' => 'upgrade-plugin_' . $this->plugin_name,
			'title' => '<img src="' . $logo_url . '" alt="Elementor">' . __( 'Rollback to Previous Version', 'elementor' ),
		];

		$this->print_inline_style();

		$upgrader = new \Plugin_Upgrader( new \Plugin_Upgrader_Skin( $upgrader_args ) );
		$upgrader->upgrade( $this->plugin_name );
	}

	/**
	 * @since 1.5.0
	 * @access public
	*/
	public function run() {
		$this->apply_package();
		$this->upgrade();
	}
}
