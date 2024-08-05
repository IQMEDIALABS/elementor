<?php

namespace Elementor\Testing\Modules\AtomicWidgets\Mocks;

use Elementor\Modules\AtomicWidgets\Base\Atomic_Widget_Base;
use Elementor\Modules\AtomicWidgets\Schema\Atomic_Prop;

class Mock_Widget_B extends Atomic_Widget_Base {
	public function __construct( $data = [] ) {
		parent::__construct($data, [] );
	}

	public function get_name() {
		return 'mock-widget-b';
	}

	protected static function define_props_schema(): array {
		return [
			'test_prop_b' => Atomic_Prop::make()
				->default( 'default-value-b' ),
		];
	}

	protected function define_atomic_controls(): array {
		return [];
	}
};
