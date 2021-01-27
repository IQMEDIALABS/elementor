<?php
namespace Elementor;

use Elementor\Core\Experiments\Manager as Experiments_Manager;
use Elementor\Core\Files\Assets\Files_Upload_Handler;
use Elementor\Core\Kits\Manager as Kits_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor tracker.
 *
 * Elementor tracker handler class is responsible for sending non-sensitive plugin
 * data to Elementor servers for users that actively allowed data tracking.
 *
 * @since 1.0.0
 */
class Tracker {

	/**
	 * API URL.
	 *
	 * Holds the URL of the Tracker API.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var string API URL.
	 */
	private static $_api_url = 'https://my.elementor.com/api/v1/tracker/';

	private static $notice_shown = false;

	/**
	 * Init.
	 *
	 * Initialize Elementor tracker.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 */
	public static function init() {
		add_action( 'elementor/tracker/send_event', [ __CLASS__, 'send_tracking_data' ] );
		add_action( 'admin_init', [ __CLASS__, 'handle_tracker_actions' ] );
	}

	/**
	 * Check for settings opt-in.
	 *
	 * Checks whether the site admin has opted-in for data tracking, or not.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param string $new_value Allowed tracking value.
	 *
	 * @return string Return `yes` if tracking allowed, `no` otherwise.
	 */
	public static function check_for_settings_optin( $new_value ) {
		$old_value = get_option( 'elementor_allow_tracking', 'no' );
		if ( $old_value !== $new_value && 'yes' === $new_value ) {
			self::send_tracking_data( true );
		}

		if ( empty( $new_value ) ) {
			$new_value = 'no';
		}
		return $new_value;
	}

	/**
	 * Send tracking data.
	 *
	 * Decide whether to send tracking data, or not.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param bool $override
	 */
	public static function send_tracking_data( $override = false ) {
		// Don't trigger this on AJAX Requests.
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		if ( ! self::is_allow_track() ) {
			return;
		}

		$last_send = self::get_last_send_time();

		/**
		 * Tracker override send.
		 *
		 * Filters whether to override sending tracking data or not.
		 *
		 * @since 1.0.0
		 *
		 * @param bool $override Whether to override default setting or not.
		 */
		$override = apply_filters( 'elementor/tracker/send_override', $override );

		if ( ! $override ) {
			$last_send_interval = strtotime( '-1 week' );

			/**
			 * Tracker last send interval.
			 *
			 * Filters the interval of between two tracking requests.
			 *
			 * @since 1.0.0
			 *
			 * @param int $last_send_interval A date/time string. Default is `strtotime( '-1 week' )`.
			 */
			$last_send_interval = apply_filters( 'elementor/tracker/last_send_interval', $last_send_interval );

			// Send a maximum of once per week by default.
			if ( $last_send && $last_send > $last_send_interval ) {
				return;
			}
		} else {
			// Make sure there is at least a 1 hour delay between override sends, we dont want duplicate calls due to double clicking links.
			if ( $last_send && $last_send > strtotime( '-1 hours' ) ) {
				return;
			}
		}

		// Update time first before sending to ensure it is set.
		update_option( 'elementor_tracker_last_send', time() );

		$params = self::get_tracking_data( empty( $last_send ) );

		add_filter( 'https_ssl_verify', '__return_false' );

		wp_safe_remote_post(
			self::$_api_url,
			[
				'timeout' => 25,
				'blocking' => false,
				// 'sslverify' => false,
				'body' => [
					'data' => wp_json_encode( $params ),
				],
			]
		);
	}

	/**
	 * Is allow track.
	 *
	 * Checks whether the site admin has opted-in for data tracking, or not.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 */
	public static function is_allow_track() {
		return 'yes' === get_option( 'elementor_allow_tracking', 'no' );
	}

	/**
	 * Handle tracker actions.
	 *
	 * Check if the user opted-in or opted-out and update the database.
	 *
	 * Fired by `admin_init` action.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 */
	public static function handle_tracker_actions() {
		if ( ! isset( $_GET['elementor_tracker'] ) ) {
			return;
		}

		if ( 'opt_into' === $_GET['elementor_tracker'] ) {
			check_admin_referer( 'opt_into' );

			self::set_opt_in( true );
		}

		if ( 'opt_out' === $_GET['elementor_tracker'] ) {
			check_admin_referer( 'opt_out' );

			self::set_opt_in( false );
		}

		wp_redirect( remove_query_arg( 'elementor_tracker' ) );
		exit;
	}

	/**
	 * @since 2.2.0
	 * @access public
	 * @static
	 */
	public static function is_notice_shown() {
		return self::$notice_shown;
	}

	public static function set_opt_in( $value ) {
		if ( $value ) {
			update_option( 'elementor_allow_tracking', 'yes' );
			self::send_tracking_data( true );
		} else {
			update_option( 'elementor_allow_tracking', 'no' );
			update_option( 'elementor_tracker_notice', '1' );
		}
	}

	/**
	 * Get system reports data.
	 *
	 * Retrieve the data from system reports.
	 *
	 * @since 2.0.0
	 * @access private
	 * @static
	 *
	 * @return array The data from system reports.
	 */
	private static function get_system_reports_data() {
		$reports = Plugin::$instance->system_info->load_reports( System_Info\Main::get_allowed_reports() );

		$system_reports = [];
		foreach ( $reports as $report_key => $report_details ) {
			$system_reports[ $report_key ] = [];
			foreach ( $report_details['report'] as $sub_report_key => $sub_report_details ) {
				$system_reports[ $report_key ][ $sub_report_key ] = $sub_report_details['value'];
			}
		}
		return $system_reports;
	}

	/**
	 * Get last send time.
	 *
	 * Retrieve the last time tracking data was sent.
	 *
	 * @since 2.0.0
	 * @access private
	 * @static
	 *
	 * @return int|false The last time tracking data was sent, or false if
	 *                   tracking data never sent.
	 */
	private static function get_last_send_time() {
		$last_send_time = get_option( 'elementor_tracker_last_send', false );

		/**
		 * Tracker last send time.
		 *
		 * Filters the last time tracking data was sent.
		 *
		 * @since 1.0.0
		 *
		 * @param int|false $last_send_time The last time tracking data was sent,
		 *                                  or false if tracking data never sent.
		 */
		$last_send_time = apply_filters( 'elementor/tracker/last_send_time', $last_send_time );

		return $last_send_time;
	}

	/**
	 * Get posts usage.
	 *
	 * Retrieve the number of posts using Elementor.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return array The number of posts using Elementor grouped by post types
	 *               and post status.
	 */
	public static function get_posts_usage() {
		global $wpdb;

		$usage = [];

		$results = $wpdb->get_results(
			"SELECT `post_type`, `post_status`, COUNT(`ID`) `hits`
				FROM {$wpdb->posts} `p`
				LEFT JOIN {$wpdb->postmeta} `pm` ON(`p`.`ID` = `pm`.`post_id`)
				WHERE `post_type` != 'elementor_library'
					AND `meta_key` = '_elementor_edit_mode' AND `meta_value` = 'builder'
				GROUP BY `post_type`, `post_status`;"
		);

		if ( $results ) {
			foreach ( $results as $result ) {
				$usage[ $result->post_type ][ $result->post_status ] = $result->hits;
			}
		}

		return $usage;

	}

	/**
	 * Get library usage.
	 *
	 * Retrieve the number of Elementor library items saved.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return array The number of Elementor library items grouped by post types
	 *               and meta value.
	 */
	public static function get_library_usage() {
		global $wpdb;

		$usage = [];

		$results = $wpdb->get_results(
			"SELECT `meta_value`, COUNT(`ID`) `hits`
				FROM {$wpdb->posts} `p`
				LEFT JOIN {$wpdb->postmeta} `pm` ON(`p`.`ID` = `pm`.`post_id`)
				WHERE `post_type` = 'elementor_library'
					AND `meta_key` = '_elementor_template_type'
				GROUP BY `post_type`, `meta_value`;"
		);

		if ( $results ) {
			foreach ( $results as $result ) {
				$usage[ $result->meta_value ] = $result->hits;
			}
		}

		return $usage;

	}

	/**
	 * Get usage of general settings.
	 * 'Elementor->Settings->General'.
	 *
	 * @return array
	 */
	public static function get_settings_general_usage() {
		$result = [];

		// Posts types.
		$result['post_types'] = get_option( 'elementor_cpt_support', Plugin::ELEMENTOR_DEFAULT_POST_TYPES );

		/** @var Kits_Manager $module */
		$kits_manager = Plugin::$instance->kits_manager;

		// Disable Default Colors.
		$result['disable_default_colors'] = $kits_manager->is_custom_colors_enabled();

		// Disable Default Fonts.
		$result['disable_default_fonts'] = $kits_manager->is_custom_typography_enabled();

		return $result;
	}

	/**
	 * Get usage of advanced settings.
	 * 'Elementor->Settings->Advanced'.
	 *
	 * @return array
	 */
	public static function get_settings_advanced_usage() {
		return [
			'css_print_method' => get_option( 'elementor_css_print_method' ),
			'switch_editor_loader_method' => get_option( Utils::EDITOR_BREAK_LINES_OPTION_KEY ),
			'enable_unfiltered_file_uploads' => get_option( Files_Upload_Handler::OPTION_KEY ),
			'font_awesome_support' => get_option( Icons_Manager::LOAD_FA4_SHIM_OPTION_KEY ),
		];
	}

	/**
	 * Get usage of experiments settings.
	 *
	 * 'Elementor->Settings->Experiments'.
	 *
	 * @return array
	 */
	public static function get_settings_experiments_usage() {
		$result = [];

		/** @var Experiments_Manager $module */
		$experiments_manager = Plugin::$instance->experiments;

		// TODO: Those keys should be at `$experiments_manager`.
		$tracking_keys = [
			'default',
			'state',
		];

		foreach ( $experiments_manager->get_features() as $feature_name => $feature_data ) {
			$data_to_collect = [];

			// Extract only tracking keys.
			foreach ( $tracking_keys as $tracking_key ) {
				$data_to_collect[ $tracking_key ] = $feature_data[ $tracking_key ];
			}

			$result[ $feature_name ] = $data_to_collect;
		}

		return $result;
	}

	/**
	 * Get usage of general tools.
	 * 'Elementor->Tools->General'.
	 *
	 * @return array
	 */
	public static function get_tools_general_usage() {
		return [
			'safe_mode' => get_option( 'elementor_safe_mode' ),
			'debug_bar' => get_option( 'elementor_enable_inspector' ),
		];
	}

	/**
	 * Get usage of 'version control' tools.
	 * 'Elementor->Tools->Version Control'.
	 *
	 * @return array
	 */
	public static function get_tools_version_control_usage() {
		return [
			'beta_tester' => get_option( 'elementor_beta' ),
		];
	}

	/**
	 * Get usage of 'maintenance' tools.
	 * 'Elementor->Tools->Maintenance'.
	 *
	 * @return array
	 */
	public static function get_tools_maintenance_usage() {
		return [
			'mode' => get_option( 'elementor_maintenance_mode_mode' ),
			'exclude' => get_option( 'elementor_maintenance_mode_exclude_mode' ),
			'template_id' => get_option( 'elementor_maintenance_mode_template_id' ),
		];
	}

	/**
	 * Get the tracking data
	 *
	 * Retrieve tracking data and apply filter
	 *
	 * @access public
	 * @static
	 *
	 * @param bool $is_first_time
	 *
	 * @return array
	 */
	public static function get_tracking_data( $is_first_time = false ) {
		$params = [
			'system' => self::get_system_reports_data(),
			'site_lang' => get_bloginfo( 'language' ),
			'email' => get_option( 'admin_email' ),
			'usages' => [
				'posts' => self::get_posts_usage(),
				'library' => self::get_library_usage(),
				'settings-general' => self::get_settings_general_usage(),
				'settings-advanced' => self::get_settings_advanced_usage(),
				'settings-experiments' => self::get_settings_experiments_usage(),
				'tools-general' => self::get_tools_general_usage(),
			],
			'is_first_time' => $is_first_time,
			'install_time' => Plugin::instance()->get_install_time(),
		];

		/**
		 * Tracker send tracking data params.
		 *
		 * Filters the data parameters when sending tracking request.
		 *
		 * @param array $params Variable to encode as JSON.
		 *
		 * @since 1.0.0
		 *
		 */
		$params = apply_filters( 'elementor/tracker/send_tracking_data_params', $params );

		return $params;
	}
}
