<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Widget_Heading_V1 extends Widget_Base_V2 {
	public function get_controls( $control_id = null ): array {
		return [
			[
				'bind' => 'tag',
				'type' => 'select',
				'label' => 'Tag',
				'default' => 'h2',
				'options' => [
					'h1' => 'H1',
					'h2' => 'H2',
					'h3' => 'H3',
					'h4' => 'H4',
					'h5' => 'H5',
					'h6' => 'H6',
				],
			],
		];
	}

	public function get_icon() {
		return 'eicon-t-letter';
	}

	public function get_title() {
		return 'Heading V1.5';
	}

	public function get_name() {
		return 'heading-v1';
	}

	protected function render() {
		$tag = $this->get_settings()['tag'] ?? 'h2';
		$content = $this->get_settings()['content'] ?? 'Hello, World!';
		$style = $this->styles['inline'];

		echo "<$tag style=\"$style\">$content</$tag>";
	}
}

