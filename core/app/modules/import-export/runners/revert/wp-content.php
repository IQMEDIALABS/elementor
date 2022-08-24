<?php

namespace Elementor\Core\App\Modules\ImportExport\Runners\Revert;

use Elementor\Core\App\Modules\ImportExport\Utils as ImportExportUtils;
use Elementor\Core\Utils\ImportExport\WP_Exporter;
use Elementor\Core\Utils\ImportExport\WP_Import;

class Wp_Content extends Revert_Runner_Base {

	public static function get_name() : string {
		return 'wp-content';
	}

	public function should_revert( array $data ) {
		return (
			isset( $data['runners'] ) &&
			array_key_exists( static::get_name(), $data['runners'] )
		);
	}

	public function revert( array $data ) {
		$builtin_post_types = ImportExportUtils::get_builtin_wp_post_types();
		$custom_post_types = $data['runners']['wp-content']['custom_post_types'] ?? [];

		$post_types = array_merge( $builtin_post_types, $custom_post_types );

		$query_args = [
			'post_type' => $post_types,
			'post_status' => 'any',
			'posts_per_page' => -1,
			'meta_query' => [
				[
					'key' => '_elementor_edit_mode',
					'compare' => 'NOT EXISTS',
				],
				[
					'key' => static::IMPORT_SESSION_META_KEY,
					'value' => $data['session_id'],
				],
			],
		];

		$query = new \WP_Query( $query_args );

		foreach ( $query->posts as $post ) {
			wp_delete_post( $post->ID, true );
		}

		/**
		 * Revert the nav menu terms.
		 * BC: The nav menu in new kits will be imported as part of the taxonomies, but old kits
		 * importing the nav menu terms as part from the wp-content import.
		 */
		$this->revert_nav_menus( $data );
	}

	private function revert_nav_menus( array $data ) {
		$terms = get_terms( [
			'taxonomy' => 'nav_menu',
			'hide_empty' => false,
			'get' => 'all',
			'meta_query' => [
				[
					'key'       => static::IMPORT_SESSION_META_KEY,
					'value'     => $data['session_id'],
				],
			],
		] );

		foreach ( $terms as $term ) {
			wp_delete_term( $term->term_id, $term->taxonomy );
		}
	}
}
