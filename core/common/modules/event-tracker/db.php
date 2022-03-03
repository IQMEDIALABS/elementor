<?php
namespace Elementor\Core\Common\Modules\EventTracker;

use Elementor\Core\Base\Base_Object;
use Elementor\Core\Common\Modules\Connect\Apps\Common_App;
use Elementor\Core\Common\Modules\Connect\Apps\Library;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class DB extends Base_Object {

	/**
	 * @var \wpdb
	 */
	private $wpdb;

	const TABLE_NAME = 'e_events';
	const DB_VERSION_OPTION_KEY = 'elementor_events_db_version';
	const CURRENT_DB_VERSION = '1.0.0';

	/**
	 * Prepare Database for Entry
	 *
	 * The events database should have a limit of up to 1000 event entries stored daily.
	 * Before adding a new entry to the database, we make sure that the limit of 1000 events is not reached.
	 * If there are 1000 or more entries in the DB, we delete the earliest-inserted entry before inserting a new one.
	 *
	 * @since 3.6.0
	 */
	public function prepare_db_for_entry() {
		$events = $this->get_event_ids_from_db();

		if ( 1000 <= count( $events ) ) {
			// Sort the array by entry ID
			$id_col = array_column( $events, 'id' );
			array_multisort( $id_col, SORT_ASC, $events );

			// Delete the smallest ID (which is the earliest DB entry)
			$this->wpdb->delete( $this->get_table_name(), [ 'ID' => $events[0]->id ] );
		}
	}

	/**
	 * Create Entry
	 *
	 * Adds an event entry to the database.
	 *
	 * @since 3.6.0
	 */
	public function create_entry( $event_data ) {
		$this->prepare_db_for_entry();

		/** @var Library $library */
		$library = Plugin::$instance->common->get_component( 'connect' )->get_app( 'library' );

		if ( $library->is_connected() ) {
			$user_connect_data = get_user_option( Common_App::OPTION_CONNECT_COMMON_DATA_KEY );

			// TODO: add user meta client_id here
			$event_data['connect_id'] = $user_connect_data['client_id'];
		}

		$timestamp = current_time( 'mysql' );

		$event_data['timestamp'] = $timestamp;

		$entry = [
			'event_data' => wp_json_encode( $event_data ),
			'created_at' => $timestamp,
		];

		$this->wpdb->insert( $this->get_table_name(), $entry );
	}

	/**
	 * Get Event IDs From DB
	 *
	 * Fetches the IDs of all events saved in the database.
	 *
	 * @since 3.6.0
	 *
	 * @return array|object|null
	 */
	public function get_event_ids_from_db() {
		$query = $this->wpdb->prepare( "SELECT id FROM {$this->get_table_name()}" );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $this->wpdb->get_results( $query );
	}

	/**
	 * Get Events Count
	 *
	 * Fetches a count of the number of events saved in the database.
	 *
	 * @since 3.6.0
	 *
	 * @return array|object|null
	 */
	public function get_events_count() {
		$query = $this->wpdb->prepare( 'SELECT COUNT(*) FROM %s', $this->get_table_name() );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $this->wpdb->get_results( $query );
	}

	/**
	 * Create Table
	 *
	 * Creates the `wp_e_events` database table.
	 *
	 * @since 3.6.0
	 *
	 * @param string $query to that looks for the Events table in the DB. Used for checking if table was created.
	 */
	private function create_table( $query ) {
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$table_name = $this->get_table_name();
		$charset_collate = $this->wpdb->get_charset_collate();

		$e_events_table = "CREATE TABLE `{$table_name}` (
			id bigint(20) unsigned auto_increment primary key,
			event_data text null,
			created_at datetime not null
		) {$charset_collate};";


		$this->wpdb->query( $e_events_table );

		// Check if table was created successfully.
		if ( $this->wpdb->get_var( $query ) === $table_name ) {
			update_option( self::DB_VERSION_OPTION_KEY, self::CURRENT_DB_VERSION, false );
		}
	}

	/**
	 * Reset Table
	 *
	 * Empties the contents of the Events DB table.
	 *
	 * @since 3.6.0
	 */
	public static function reset_table() {
		global $wpdb;

		$table_name = $wpdb->prefix . self::TABLE_NAME;

		// Delete all content of the table.
		$wpdb->query( $wpdb->prepare( "truncate table {$table_name};" ) );
	}

	/**
	 * Add Indexes
	 *
	 * Adds an index to the events table for the creation date column.
	 *
	 * @since 3.6.0
	 */
	private function add_indexes() {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$this->wpdb->query( 'ALTER TABLE ' . $this->get_table_name() . '
    		ADD INDEX `created_at_index` (`created_at`)
		' );
	}

	/**
	 * Get Table Name
	 *
	 * Returns the Events database table's name with the `wpdb` prefix.
	 *
	 * @since 3.6.0
	 *
	 * @return string
	 */
	public function get_table_name() {
		return $this->wpdb->prefix . self::TABLE_NAME;
	}

	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;

		// Check if table exists. If not, create it.
		$query = $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $this->get_table_name() ) );

		if ( $wpdb->get_var( $query ) !== $this->get_table_name() ) {
			$this->create_table( $query );
			$this->add_indexes();
		}
	}
}
