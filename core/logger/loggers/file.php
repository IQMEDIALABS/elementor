<?php
namespace Elementor\Core\Logger\Loggers;

use Elementor\Core\Logger\Items\Base as Log_Item;
use Elementor\Core\Logger\Items\Log_Item_Interface as Log_Item_Interface;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class File
 * writes log entries to a log file located at uploads/elementor/logs directory.
 * ** based on code by Woocommerce.
 * @package Elementor\Core\Logger\Loggers
 */
class File extends Base {
	const LOGFILE_TYPE = '.log';
	const ELEMENTOR_LOG_DIR = '/elementor/logs/';
	const LOGFILE_MAX_SIZE = 32768; //32k
	const FILE_DELIMITER = '<!----LOG_ENTRY---->';

	private $file_handle;
	private $file_name;
	private $dir_name;
	private $file_size_limit;

	public function __construct( $filename = '', $log_file_limit = 0 ) {
		$this->file_size_limit = 0 === $log_file_limit ? self::LOGFILE_MAX_SIZE : $log_file_limit;
		$this->dir_name = wp_upload_dir()['basedir'] . self::ELEMENTOR_LOG_DIR;
		$this->file_name = empty( $filename ) ? self::LOG_NAME : $filename;
		$this->file_handle = null;
	}

	public function __destruct() {
		if ( $this->file_handle ) {
			@fclose( $this->file_handle ); // @codingStandardsIgnoreLine
		}
	}

	private function format_full_path_name() {
		$file_date = date( 'Y-m-d' );
		return $this->dir_name . $this->file_name . '-' . $file_date . self::LOGFILE_TYPE;
	}

	private function open() {
		if ( ! file_exists( $this->dir_name ) ) {
			if ( wp_mkdir_p( $this->dir_name ) ) {
				file_put_contents( $this->dir_name . '/index.html', '' ); // @codingStandardsIgnoreLine
				file_put_contents( $this->dir_name . '/.htaccess', 'Deny from all' ); // @codingStandardsIgnoreLine
			}
		}

		$file_name = $this->format_full_path_name();
		$this->file_handle = @fopen( $file_name, 'a+' ); // @codingStandardsIgnoreLine

		return $this->file_handle ? true : false;
	}

	private function should_archive_log() {
		$fstats = fstat( $this->file_handle );
		if ( $fstats['size'] >= $this->file_size_limit ) {
			return true;
		}
		return false;
	}

	private function archive_log() {
		$timestamp = time();
		$fullname = $this->format_full_path_name();
		$new_name = substr( $fullname, strlen( self::LOGFILE_TYPE ) );
		@fclose( $this->file_handle ); // @codingStandardsIgnoreLine
		rename( $fullname, $new_name . '.' . $timestamp . self::LOGFILE_TYPE );
		$this->file_handle = @fopen( $fullname, 'a+' ); // @codingStandardsIgnoreLine
	}

	public function save_log( Log_Item_Interface $item ) {
		if ( ! $this->open() ) {
			return;
		}

		if ( $this->should_archive_log() ) {
			$this->archive_log();
		}

		$serialized = wp_json_encode( $item ) . self::FILE_DELIMITER;
		fwrite( $this->file_handle, $serialized ); // @codingStandardsIgnoreLine
		fflush( $this->file_handle );
	}

	protected function get_log() {
		$logname = $this->format_full_path_name();

		if ( ! file_exists( $logname ) ) {
			return [
				'All' => [
					'total_count' => 0,
					'count' => 0,
					'entries' => '',
				],
			];
		}

		$file_data = file_get_contents( $logname ); // @codingStandardsIgnoreLine
		$lines = explode( self::FILE_DELIMITER, $file_data );
		$items = [];
		foreach ( $lines as $line ) {
			if ( ! empty( $line ) ) {
				$item = Log_Item::from_json( $line );
				if ( null !== $item ) {
					$items[] = $item;
				}
			}
		}
		return $items;
	}
}
