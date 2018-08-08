<?php
namespace Elementor\Testing;

class Elementor_Test_Base extends \WP_UnitTestCase {
	/**
	 * @var Local_Factory
	 */
	private static $local_factory;

	public function __get( $name ) {
		if ( 'factory' === $name ) {
			return self::factory();
		}
	}

	/**
	 * @return \Elementor\Testing\Local_Factory|\WP_UnitTest_Factory
	 */
	protected static function factory() {
		if ( ! self::$local_factory ) {
			self::$local_factory = Manager::$instance->get_local_factory();
		}

		return self::$local_factory;
	}

	/**
	 * Asserts that an array have specified keys.
	 *
	 * @param array $keys
	 * @param array|\ArrayAccess $array
	 * @param string $message
	 */
	protected function assertArrayHaveKeys( $keys, $array, $message = '' ) {
		if ( ! is_array( $keys ) ) {
			throw \PHPUnit_Util_InvalidArgumentHelper::factory(
				1,
				'only array'
			);
		}

		foreach ( $keys as $key ) {
			$this->assertArrayHasKey( $key, $array, $message );
		}

	}
}
