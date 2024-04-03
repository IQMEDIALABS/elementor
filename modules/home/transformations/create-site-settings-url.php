<?php
namespace Elementor\Modules\Home\Transformations;

use Elementor\Core\Base\Document;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Create_Site_Settings_Url extends Base\Transformations_Abstract {

	public function transform( array $home_screen_data ): array {
		$existing_elementor_page = $this->get_elementor_page();
		$site_settings_url = ! empty( $existing_elementor_page ) ?
			$this->get_elementor_edit_url( $existing_elementor_page->ID ) :
			Plugin::$instance->documents->get_create_new_post_url( 'page' );

		$home_screen_data['get_started'][0]['repeater'][] = [
			'title' => 'Site Settings',
			'title_small' => 'Customize',
			'url' => $site_settings_url,
			'is_relative_url' => false,
			'title_small_color' => 'promotion.main',
			'new_page' => empty( $existing_elementor_page ),
			'type' => 'site_settings',
		];

		return $home_screen_data;
	}

	private function get_elementor_edit_url( int $post_id ) {
		$active_kit_id = Plugin::$instance->kits_manager->get_active_id();
		$document = Plugin::$instance->documents->get( $post_id );

		return add_query_arg( [ 'active-document' => $active_kit_id ], $document->get_edit_url() );
	}

	private function get_elementor_page() {
		$args = array(
			'meta_key' => Document::BUILT_WITH_ELEMENTOR_META_KEY,
			'sort_order' => 'asc',
			'sort_column' => 'post_date',
		);
		$pages = get_pages( $args );

		if ( empty( $pages ) ) {
			return null;
		}

		$home_page_id = get_option( 'page_on_front' );

		foreach ( $pages as $page ) {
			if ( (string) $page->ID === $home_page_id ) {
				return $page;
			}
		}

		return $pages[0];
	}
}
