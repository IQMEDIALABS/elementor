<?php

namespace Elementor\Tests\Phpunit\Elementor\Core\Logger;

use ElementorEditorTesting\Elementor_Test_Base;

class Test_Manager extends Elementor_Test_Base {

	/**
	 * @var \Elementor\Core\Logger\Manager
	 */
	private $manager;

	public function setUp() {
		// Mock 'shutdown' method to avoid exit.
		$this->manager = $this->getMockBuilder( \Elementor\Core\Logger\Manager::class )
		                      ->setMethods( [ 'shutdown' ] )
		                      ->getMock();

		$this->manager->method( 'shutdown' )
		              ->willReturn( true );
	}

	private function fake_rest_error_handler( $file ) {
		$error_data = $this->manager->rest_error_handler( 1, 0, $file, 0 );

		return isset( $error_data['file'] ) && $error_data['file'] === $file;
	}

	public function test_rest_error_handler__error_in_elementor_path() {
		$this->assertTrue( $this->fake_rest_error_handler( __FILE__ ) );
	}

	public function test_rest_error_handler__error_in_non_elementor_path() {
		$this->assertFalse( $this->fake_rest_error_handler( 'elementor/experts/files/test' ) );
	}
}
