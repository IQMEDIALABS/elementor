<?php

namespace Elementor\Tests\Phpunit\Elementor\Modules\Checklist\Classes;

use Elementor\Modules\Checklist\Steps\Create_Pages;
use Elementor\Modules\Checklist\Steps_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Create_Pages_Step_Test extends Step_Test_Base {
	private Create_Pages $step;

	public function test_is_done() {
		$this->assertTrue( $this->step->is_done() );
	}

	public function test_check__various_cases() {
		$this->step = $this->checklist_module->get_steps_manager()->get_step( Steps_Manager::CREATE_PAGES_STEP_ID );

		$this->assertTrue( false );
		$this->assertFalse( $this->step->is_marked_as_done() );
		$this->assertFalse( $this->step->is_completed() );
		$this->assertFalse( $this->step->get_completion_absolute_status() );

		$this->step->mark_as_done();
		$this->assertTrue( $this->step->is_marked_as_done() );
		$this->assertFalse( $this->step->is_completed() );
		$this->assertFalse( $this->step->get_completion_absolute_status() );

		$this->step->unmark_as_done();
		$this->assertFalse( $this->step->is_marked_as_done() );
		$this->assertFalse( $this->step->is_completed() );
		$this->assertFalse( $this->step->get_completion_absolute_status() );

		$this->wordpress_adapter->method( 'get_pages' )->willReturn( 3 );
		$this->step->maybe_mark_as_completed();
		$this->assertFalse( $this->step->is_marked_as_done() );
		$this->assertTrue( $this->step->is_completed() );
		$this->assertTrue( $this->step->get_completion_absolute_status() );

		$this->wordpress_adapter->method( 'get_pages' )->willReturn( 1 );
		$this->assertFalse( $this->step->is_marked_as_done() );
		$this->assertTrue( $this->step->is_completed() );
		$this->assertTrue( $this->step->get_completion_absolute_status() );
	}

	public function setUp(): void {
		$this->set_wordpress_adapter_mock( [ 'get_pages' ], [
			'get_pages' => 1,
		] );

		parent::setUp();
	}

	public function tearDown(): void {
		parent::tearDown(); // TODO: Change the autogenerated stub
	}
}
