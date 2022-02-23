<?php
namespace Elementor\Core\Common\Modules\Connect;

use Elementor\Core\Base\App;
use Elementor\Plugin;
use Elementor\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Admin extends App {

	const PAGE_ID = 'elementor-connect';

	public static $url = '';

	public function get_name() {
		return 'elementor-connect-admin';
	}

	/**
	 * @since 2.3.0
	 * @access public
	 */
	public function register_admin_menu() {
		$submenu_page = add_submenu_page(
			Settings::PAGE_ID,
			__( 'Connect', 'elementor' ),
			__( 'Connect', 'elementor' ),
			'edit_posts',
			self::PAGE_ID,
			[ $this, 'render_page' ]
		);

		add_action( 'load-' . $submenu_page, [ $this, 'on_load_page' ] );
	}

	/**
	 * @since 2.3.0
	 * @access public
	 */
	public function hide_menu_item() {
		remove_submenu_page( Settings::PAGE_ID, self::PAGE_ID );
	}

	/**
	 * @since 2.3.0
	 * @access public
	 */
	public function on_load_page() {
		if ( isset( $_GET['action'], $_GET['app'] ) ) {
			$manager = Plugin::$instance->common->get_component( 'connect' );
			$app_slug = $_GET['app'];
			$app = $manager->get_app( $app_slug );
			$nonce_action = $_GET['app'] . $_GET['action'];

			if ( ! $app ) {
				wp_die( 'Unknown app: ' . esc_attr( $app_slug ) );
			}

			if ( empty( $_GET['nonce'] ) || ! wp_verify_nonce( $_GET['nonce'], $nonce_action ) ) {
				wp_die( 'Invalid Nonce', 'Invalid Nonce', [
					'back_link' => true,
				] );
			}

			$method = 'action_' . $_GET['action'];

			if ( method_exists( $app, $method ) ) {
				call_user_func( [ $app, $method ] );
			}
		}
	}

	/**
	 * @since 2.3.0
	 * @access public
	 */
	public function render_page() {
		$apps = Plugin::$instance->common->get_component( 'connect' )->get_apps();
		?>
		<style>
			.elementor-connect-app-wrapper{
				margin-bottom: 50px;
				overflow: hidden;
			}
		</style>
		<div class="wrap">
			<?php

			/** @var \Elementor\Core\Common\Modules\Connect\Apps\Base_App $app */
			foreach ( $apps as $app ) {
				echo '<div class="elementor-connect-app-wrapper">';
				echo '<div id="elementor-connect-admin-test"></div>';
				$app->render_admin_widget();
				echo '</div>';
			}

			?>
		</div><!-- /.wrap -->
		<?php
	}

	/**
	 * Check if the current admin page is the component page.
	 *
	 * @return bool
	 */
	private function is_current() {
		// Nonce verification not required here.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return ( ! empty( $_GET['page'] ) && self::PAGE_ID === $_GET['page'] );
	}

	/**
	 * Enqueue admin scripts
	 */
	private function enqueue_scripts() {
		wp_enqueue_script(
			'elementor-connect-admin-test',
			$this->get_js_assets_url( 'elementor-connect-admin-test' ),
			[
				'wp-url',
				'wp-i18n',
				'wp-date',
				'react',
				'react-dom',
			],
			ELEMENTOR_VERSION,
			true
		);
	}

	/**
	 * @since 2.3.0
	 * @access public
	 */
	public function __construct() {
		self::$url = admin_url( 'admin.php?page=' . self::PAGE_ID );

		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 206 );
		add_action( 'admin_head', [ $this, 'hide_menu_item' ] );

		if ( $this->is_current() ) {
			add_action( 'admin_enqueue_scripts', function () {
				$this->enqueue_scripts();
			} );
		}
	}
}
