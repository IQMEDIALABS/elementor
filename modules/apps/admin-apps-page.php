<?php
namespace Elementor\Modules\Apps;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Admin_Apps_Page {

	const APPS_URL = 'https://assets.elementor.com/apps/v1/apps.json';

	public static function render() {
		?>
		<div class="wrap e-a-apps">

			<div class="e-a-page-title">
				<h2><?php echo esc_html__( 'Popular Addons, New Possibilities.', 'elementor' ); ?></h2>
				<p><?php echo esc_html__( 'Boost your web-creation process with add-ons, plugins, and more tools specially selected to unleash your creativity, increase productivity, and enhance your Elementor-powered website.', 'elementor' ); ?>*<br>
					<a href="https://go.elementor.com/wp-dash-apps-about-apps-page/" target="_blank"><?php echo esc_html__( 'Learn more about this page.', 'elementor' ); ?></a>
				</p>
			</div>

			<div class="e-a-list">
				<?php self::render_plugins_list(); ?>
			</div>
			<div class="e-a-page-footer">
				<p>*<?php echo esc_html__( 'Please note that certain tools and services on this page are developed by third-party companies and are not part of Elementor\'s suite of products or support. Before using them, we recommend independently evaluating them. Additionally, when clicking on their action buttons, you may be redirected to an external website.', 'elementor' ); ?></p>
			</div>
		</div>
		<?php
	}

	private static function render_plugins_list() {
		$plugins = self::get_plugins();

		foreach ( $plugins as $plugin ) {
			self::render_plugin_item( $plugin );
		}
	}

	private static function get_plugins() : array {
		$apps = static::get_remote_apps();

		return static::filter_apps( $apps );
	}

	private static function get_remote_apps() {
		$apps = wp_remote_get( static::APPS_URL );

		if ( is_wp_error( $apps ) ) {
			return [];
		}

		$apps = json_decode( wp_remote_retrieve_body( $apps ), true );

		if ( empty( $apps['apps'] ) || ! is_array( $apps['apps'] ) ) {
			return [];
		}

		return $apps['apps'];
	}

	private static function filter_apps( $apps ) {
		$filtered_apps = [];

		foreach ( $apps as $app ) {
			if ( static::is_wporg_app( $app ) ) {
				$app = static::filter_wporg_app( $app );
			}

			if ( static::is_ecom_app( $app ) ) {
				$app = static::filter_ecom_app( $app );
			}

			if ( empty( $app ) ) {
				continue;
			}

			$filtered_apps[] = $app;
		}

		return $filtered_apps;
	}

	private static function is_wporg_app( $app ) {
		return isset( $app['type'] ) && 'wporg' === $app['type'];
	}

	private static function filter_wporg_app( $app ) {
		if ( static::is_plugin_activated( $app['file_path'] ) ) {
			return null;
		}

		if ( static::is_plugin_installed( $app['file_path'] ) ) {
			if ( current_user_can( 'activate_plugins' ) ) {
				$app['action_label'] = 'Activate';
				$app['action_url'] = static::get_activate_plugin_url( $app['file_path'] );
			} else {
				$app['action_label'] = 'Cannot Activate';
				$app['action_url'] = '#';
			}
		} else {
			if ( current_user_can( 'install_plugins' ) ) {
				$app['action_label'] = 'Install';
				$app['action_url'] = static::get_install_plugin_url( $app['file_path'] );
			} else {
				$app['action_label'] = 'Cannot Install';
				$app['action_url'] = '#';
			}
		}

		return $app;
	}

	private static function is_ecom_app( $app ) {
		return isset( $app['type'] ) && 'ecom' === $app['type'];
	}

	private static function filter_ecom_app( $app ) {
		if ( static::is_plugin_activated( $app['file_path'] ) ) {
			return null;
		}

		if ( ! static::is_plugin_installed( $app['file_path'] ) ) {
			return $app;
		}

		if ( current_user_can( 'activate_plugins' ) ) {
			$app['action_label'] = 'Activate';
			$app['action_url'] = static::get_activate_plugin_url( $app['file_path'] );
		} else {
			$app['action_label'] = 'Cannot Activate';
			$app['action_url'] = '#';
		}

		$app['target'] = '_self';

		return $app;
	}

	private static function get_images_url() {
		return ELEMENTOR_URL . 'modules/apps/images/';
	}

	private static function is_elementor_pro_installed() {
		return defined( 'ELEMENTOR_PRO_VERSION' );
	}

	private static function is_plugin_installed( $file_path ) {
		$installed_plugins = get_plugins();

		return isset( $installed_plugins[ $file_path ] );
	}

	private static function is_plugin_activated( $file_path ) {
		return is_plugin_active( $file_path );
	}

	private static function get_activate_plugin_url( $file_path ) {
		return wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $file_path . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $file_path );
	}

	private static function get_install_plugin_url( $file_path ) {
		$slug = dirname( $file_path );

		return wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=' . $slug ), 'install-plugin_' . $slug );
	}

	private static function render_plugin_item( $plugin ) {
		?>
		<div class="e-a-item">
			<div class="e-a-heading">
				<img class="e-a-img" src="<?php echo esc_url( $plugin['image'] ); ?>" alt="<?php echo esc_attr( $plugin['name'] ); ?>">
				<?php if ( ! empty( $plugin['badge'] ) ) : ?>
					<span class="e-a-badge"><?php echo esc_html( $plugin['badge'] ); ?></span>
				<?php endif; ?>
			</div>
			<h3 class="e-a-title"><?php echo esc_html( $plugin['name'] ); ?></h3>
			<p class="e-a-author"><?php esc_html_e( 'By', 'elementor' ); ?> <a href="<?php echo esc_url( $plugin['author_url'] ); ?>" target="_blank"><?php echo esc_html( $plugin['author'] ); ?></a></p>
			<div class="e-a-desc">
				<p><?php echo esc_html( $plugin['description'] ); ?></p>
				<?php if ( ! empty( $plugin['offering'] ) ) : ?>
					<p class="e-a-offering"><?php echo esc_html( $plugin['offering'] ); ?></p>
				<?php endif; ?>
			</div>

			<p class="e-a-actions">
				<?php if ( ! empty( $plugin['learn_more_url'] ) ) : ?>
					<a class="e-a-learn-more" href="<?php echo esc_url( $plugin['learn_more_url'] ); ?>" target="_blank"><?php echo esc_html__( 'Learn More', 'elementor' ); ?></a>
				<?php endif; ?>
				<a href="<?php echo esc_url( $plugin['action_url'] ); ?>" class="e-btn e-accent" target="<?php echo isset( $plugin['target'] ) ? esc_attr( $plugin['target'] ) : '_blank'; ?>"><?php echo esc_html( $plugin['action_label'] ); ?></a>
			</p>
		</div>
		<?php
	}
}
