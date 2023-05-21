<?php

namespace Elementor\Tests\Phpunit\Elementor\Core\Config;

use ElementorEditorTesting\Elementor_Test_Base;

class User_Option_Test extends \Elementor\Core\Config\User_Config_Base {

	public static function get_key() {
		return 'test';
	}

	public static function get_default() {
		return 'default-value';
	}

	protected static function get_options() {
		return [
			'test' => 'Test',
		];
	}
}

class Test_User_Option extends Elementor_Test_Base {

	public function setUp() {
		parent::setUp();

		$this->act_as_admin();
	}

	public function test__get() {
		// Act
		$this->set_test_value();

		// Assert
		$this->assertEquals('test' , User_Option_Test::get() );
	}

	public function test__set() {
		// Act
		User_Option_Test::set( 'test' );

		// Assert
		$this->assertEquals('test' , get_user_option( 'elementor_test', get_current_user_id() ) );
	}

	public function test__get_default() {
		// Assert
		$this->assertEquals('default-value' , User_Option_Test::get() );
	}

	public function test_delete() {
		// Arrange
		$this->test__get();

		// Act
		User_Option_Test::delete();

		// Assert
		$this->assertEmpty( get_user_option( 'elementor_test', get_current_user_id() ) );
	}

	private function set_test_value() {
		update_user_option( get_current_user_id(), 'elementor_test', 'test' );
	}

	public function tearDown() {
		parent::tearDown();

		// Cleanup
		delete_user_option( get_current_user_id(), 'elementor_test' );
	}
}
