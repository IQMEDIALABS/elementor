<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Text_Control {
	const KEY = 'text';
	private string $placeholder = '';

	public static function make(): self {
		return new static();
	}

	public function set_placeholder( string $placeholder ): self {
		$this->placeholder = $placeholder;

		return $this;
	}

	public function get_placeholder(): string {
		return $this->placeholder;
	}

	public function get_props(): array {
		return [
			'placeholder' => $this->get_placeholder(),
		];
	}
}
