<?php
namespace Elementor\Modules\ProInstall;

class Plugin_Installer {

	private $plugin_slug;
	private $package_url;

	public function __construct( $plugin_slug, $package_url = null ) {
		$this->plugin_slug = $plugin_slug;
		$this->package_url = $package_url;
	}

	public function install() {
		$package_url = $this->get_package_url();

		if ( is_wp_error( $package_url ) ) {
			return $package_url;
		}

		$this->includes_dependencies();

		$install_result = $this->do_install();
		if ( null === $install_result || is_wp_error( $install_result ) ) {
			return new \WP_Error( 'cant_installed', sprintf( 'The requested plugin `%s` could not be installed', $this->plugin_slug ) );
		}

		$is_activated = $this->activate();
		if ( is_wp_error( $is_activated ) ) {
			return $is_activated;
		}

		return true;
	}

	private function get_package_url() {
		return $this->package_url;
	}

	private function includes_dependencies() {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		include_once ABSPATH . '/wp-admin/includes/admin.php';
		include_once ABSPATH . '/wp-admin/includes/plugin-install.php';
		include_once ABSPATH . '/wp-admin/includes/plugin.php';
		include_once ABSPATH . '/wp-admin/includes/class-wp-upgrader.php';
		include_once ABSPATH . '/wp-admin/includes/class-plugin-upgrader.php';
	}

	private function do_install() {
		$upgrader = new \Plugin_Upgrader( new \Automatic_Upgrader_Skin() );

		return $upgrader->install( $this->get_package_url() );
	}

	private function get_plugin_path() {
		$plugins = get_plugins();
		$installed_plugins = [];

		foreach ( $plugins as $path => $plugin ) {
			$path_parts = explode( '/', $path );
			$slug = $path_parts[0];
			$installed_plugins[ $slug ] = $path;
		}

		if ( empty( $installed_plugins[ $this->plugin_slug ] ) ) {
			return false;
		}

		return $installed_plugins[ $this->plugin_slug ];
	}

	public function activate() {
		$plugin_path = $this->get_plugin_path();

		if ( ! $plugin_path ) {
			return new \WP_Error( 'no_installed', sprintf( 'The requested plugin `%s` is not installed', $this->plugin_slug ) );
		}

		$activate_result = activate_plugin( $plugin_path );

		if ( is_wp_error( $activate_result ) ) {
			return $activate_result;
		}

		Manager::add_managed_plugin( $plugin_path );

		return true;
	}
}
