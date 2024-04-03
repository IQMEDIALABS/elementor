<?php
namespace Elementor\Tests\Phpunit\Elementor\Modules\Home\Transformations;

use Elementor\Modules\Home\Transformations\Generate_Sidebar_Upgrade_For_Core_And_Pro;
use PHPUnit\Framework\TestCase as PHPUnit_TestCase;

class Test_Generate_Sidebar_Upgrade_For_Core_And_Pro extends PHPUnit_TestCase {

	public function test_transform__core_plugin() {
		// Arrange
		$original_data = $this->mock_home_screen_data();

		$transformation = new Generate_Sidebar_Upgrade_For_Core_And_Pro( [] );

		// Act
		$transformed_data = $transformation->transform( $original_data );
		$expected_data = $this->mock_home_screen_data_transformed_core();

		// Assert
		$this->assertTrue( $transformed_data === $expected_data );
	}

	public function test_transform__pro_plugin() {
		// Arrange
		$original_data = $this->mock_home_screen_data();

		$transformation = new Generate_Sidebar_Upgrade_For_Core_And_Pro( [] );
		$transformation->has_pro = true;

		// Act
		$transformed_data = $transformation->transform( $original_data );
		$expected_data = $this->mock_home_screen_data_transformed_pro();
		var_dump($transformed_data);
		// Assert
		$this->assertTrue( $transformed_data === $expected_data );
	}

	public function test_transform__core_show_is_false() {
		// Arrange
		$original_data = $this->mock_home_screen_data_show_is_false();

		$transformation = new Generate_Sidebar_Upgrade_For_Core_And_Pro( [] );

		// Act
		$transformed_data = $transformation->transform( $original_data );
		$expected_data = $this->mock_home_screen_data_transformed();

		// Assert
		$this->assertTrue( $transformed_data === $expected_data );
	}

	private function mock_home_screen_data() {
		return [
			'sidebar_upgrade' => [
				[
					'thing' => [
						'key' => 'value',
					],
					'license' => [
						'free'
					],
					'show' => 'true',
				],
				[
					'thing' => [
						'key' => 'value',
					],
					'license' => [
						"essential-empty",
						"essential-essential-oct2023",
						"advanced-empty"
					],
					'show' => 'true',
				],
			],
			'misc' => [
				'Name' => 'Microsoft',
				'Version' => 'Windows',
			],
		];
	}

	private function mock_home_screen_data_show_is_false() {
		return [
			'sidebar_upgrade' => [
				[
					'thing' => [
						'key' => 'value',
					],
					'license' => [
						'free'
					],
					'show' => 'false',
				],
				[
					'thing' => [
						'key' => 'value',
					],
					'license' => [
						"essential-empty",
						"essential-essential-oct2023",
						"advanced-empty"
					],
					'show' => 'false',
				],
			],
			'misc' => [
				'Name' => 'Microsoft',
				'Version' => 'Windows',
			],
		];
	}


	private function mock_home_screen_data_transformed_core() {
		return [
			'sidebar_upgrade' =>
				[
					'thing' => [
						'key' => 'value',
					],
					'license' => [
						'free'
					],
					'show' => 'true',
				],
			'misc' => [
				'Name' => 'Microsoft',
				'Version' => 'Windows',
				],
		];
	}

	private function mock_home_screen_data_transformed_pro() {
		return [
			'sidebar_upgrade' => [
					'thing' => [
						'key' => 'value',
					],
					'license' => [
						"essential-empty",
						"essential-essential-oct2023",
						"advanced-empty"
					],
					'show' => 'true',
				],
			'misc' => [
				'Name' => 'Microsoft',
				'Version' => 'Windows',
			],
		];
	}

	private function mock_home_screen_data_transformed() {
		return [
			'misc' => [
				'Name' => 'Microsoft',
				'Version' => 'Windows',
			],
		];
	}
}

