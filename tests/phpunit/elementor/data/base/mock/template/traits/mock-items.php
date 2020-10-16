<?php
namespace Elementor\Tests\Phpunit\Elementor\Data\Base\Mock\Template\Traits;

trait MockItems {
	use MockTestData;

	public function get_items( $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::get_items( $request );
	}

	public function get_item( $id, $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::get_item( $id, $request );
	}

	public function create_items( $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::create_items( $request );
	}

	public function create_item( $id, $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::create_item( $id, $request );
	}

	public function update_item( $id, $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::update_item( $id, $request );
	}

	public function update_items( $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::update_items( $request );
	}

	public function delete_item( $id, $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::delete_item( $id, $request );
	}

	public function delete_items( $request ) {
		$test_data = $this->get_test_data( __FUNCTION__ );

		if ( $test_data ) {
			return $test_data;
		}

		return parent::delete_items( $request );
	}
}
