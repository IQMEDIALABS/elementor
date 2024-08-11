<?php

namespace Elementor\Tests\Phpunit\Elementor\Modules\Checklist\Classes;

use Elementor\Modules\Checklist\Steps\Create_Pages;
use Elementor\Modules\Checklist\Steps_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Test_Create_Pages_Step extends Step_Test_Base {
	private Create_Pages $step;

	public function test__various_cases() {
		$steps_manager = $this->checklist_module->get_steps_manager();
		$step = $steps_manager->get_step_by_id( Create_Pages::STEP_ID );

		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertFalse( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );

		$step->mark_as_completed();
		$this->assertTrue( $step->is_marked_as_completed() );
		$this->assertFalse( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );

		$step->unmark_as_completed();
		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertFalse( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );

		$this->set_wordpress_adapter_mock( [ 'get_pages' ], [
			'get_pages' => [ [], [], [] ],
		] );
		$step = new Create_Pages( $this->checklist_module, $this->wordpress_adapter );
		$step_config = $steps_manager->get_step_config( Create_Pages::STEP_ID );
		$step->maybe_mark_as_completed( $step_config );
		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertTrue( $step->is_immutable_completed() );
		$this->assertTrue( $step->is_absolute_completed() );

		$this->set_wordpress_adapter_mock( [ 'get_pages' ], [
			'get_pages' => [ [] ],
		] );

		$step = new Create_Pages( $this->checklist_module, $this->wordpress_adapter );
		$this->assertFalse( $step->is_marked_as_completed() );
		$this->assertTrue( $step->is_immutable_completed() );
		$this->assertFalse( $step->is_absolute_completed() );
	}

	public function setUp(): void {
		$this->set_wordpress_adapter_mock( [ 'get_pages' ], [
			'get_pages' => [ [] ],
		] );

		parent::setUp();
	}

	public function tearDown(): void {
		parent::tearDown(); // TODO: Change the autogenerated stub
	}
}
