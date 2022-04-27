<?php
namespace Elementor\Modules\WpCli;

use Elementor\Api;
use Elementor\Plugin;
use Elementor\TemplateLibrary\Source_Local;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Elementor Page Builder cli tools.
 */
class Command extends \WP_CLI_Command {

	/**
	 * Flush the Elementor Page Builder CSS Cache.
	 *
	 * [--network]
	 *      Flush CSS Cache for all the sites in the network.
	 *
	 * ## EXAMPLES
	 *
	 *  1. wp elementor flush-css
	 *      - This will flush the CSS files for elementor page builder.
	 *
	 *  2. wp elementor flush-css --network
	 *      - This will flush the CSS files for elementor page builder for all the sites in the network.
	 *
	 * @since 2.1.0
	 * @access public
	 * @alias flush-css
	 */
	public function flush_css( $args, $assoc_args ) {
		$network = ! empty( $assoc_args['network'] ) && is_multisite();

		if ( $network ) {
			/** @var \WP_Site[] $blogs */
			$blogs = get_sites();

			foreach ( $blogs as $keys => $blog ) {
				// Cast $blog as an array instead of  object
				$blog_id = $blog->blog_id;

				switch_to_blog( $blog_id );

				Plugin::$instance->files_manager->clear_cache();

				\WP_CLI::success( 'Flushed the Elementor CSS Cache for site - ' . get_option( 'home' ) );

				restore_current_blog();
			}
		} else {
			Plugin::$instance->files_manager->clear_cache();

			\WP_CLI::success( 'Flushed the Elementor CSS Cache' );
		}
	}

	/**
	 * Print system info powered by Elementor
	 *
	 * ## EXAMPLES
	 *
	 *  1. wp elementor system-info
	 *      - This will print the System Info in JSON format
	 *
	 * @since 3.0.11
	 * @access public
	 * @alias system-info
	 */
	public function system_info() {
		echo wp_json_encode( \Elementor\Tracker::get_tracking_data() );
	}

	/**
	 * Replace old URLs with new URLs in all Elementor pages.
	 *
	 * [--force]
	 *      Suppress error messages. instead, return "0 affected rows.".
	 *
	 * ## EXAMPLES
	 *
	 *  1. wp elementor replace-urls <old> <new>
	 *      - This will replace all <old> URLs with the <new> URL.
	 *
	 *  2. wp elementor replace-urls <old> <new> --force
	 *      - This will replace all <old> URLs with the <new> URL without throw errors.
	 *
	 * @access public
	 * @alias replace-urls
	 */
	public function replace_urls( $args, $assoc_args ) {
		if ( empty( $args[0] ) ) {
			\WP_CLI::error( 'Please set the `old` URL' );
		}

		if ( empty( $args[1] ) ) {
			\WP_CLI::error( 'Please set the `new` URL' );
		}

		try {
			$results = Utils::replace_urls( $args[0], $args[1] );
			\WP_CLI::success( $results );
		} catch ( \Exception $e ) {
			if ( isset( $assoc_args['force'] ) ) {
				\WP_CLI::success( '0 rows affected.' );
			} else {
				\WP_CLI::error( $e->getMessage() );
			}
		}
	}
}
