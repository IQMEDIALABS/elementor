<?php
namespace Elementor\Tests\Phpunit\Elementor\Core\Kits;

use Elementor\Core\Kits\Documents\Kit;
use Elementor\Plugin;
use Elementor\Testing\Elementor_Test_Base;

class Test_Upgrades extends Elementor_Test_Base {

	public function test_get_active_id() {
		// Test deleted kit.
		$test_description = 'active id should return a new kit id after delete kit';
		$active_id = Plugin::$instance->kits_manager->get_active_id();
		wp_delete_post( $active_id, true );
		$active_id_after_delete = Plugin::$instance->kits_manager->get_active_id();
		$this->assertNotEquals( $active_id, $active_id_after_delete, $test_description );

		// Test trashed kit.
		$test_description = 'active id should return a new kit id after trash kit';
		$active_id = Plugin::$instance->kits_manager->get_active_id();
		wp_trash_post( $active_id );
		$active_id_after_trash = Plugin::$instance->kits_manager->get_active_id();
		$this->assertNotEquals( $active_id, $active_id_after_trash, $test_description );

		// Test unpublished kit.
		$test_description = 'active id should return a new kit id after trash kit';
		$active_id = Plugin::$instance->kits_manager->get_active_id();
		wp_trash_post( $active_id );
		$active_id_after_trash = Plugin::$instance->kits_manager->get_active_id();
		$this->assertNotEquals( $active_id, $active_id_after_trash, $test_description );

		// Test invalid kit.
		$test_description = 'active id should return a new kit id after for invalid kit';
		$active_id = Plugin::$instance->kits_manager->get_active_id();
		update_post_meta( $active_id, Kit::TYPE_META_KEY, 'invalid-type' );
		// Invalidate cache.
		Plugin::$instance->documents->get( $active_id, false );
		$active_id_after_invalidate = Plugin::$instance->kits_manager->get_active_id();
		$this->assertNotEquals( $active_id, $active_id_after_invalidate, $test_description );
	}
}
