<?php

namespace Elementor\Modules\ConversionCenter\Traits;

use Elementor\Controls_Manager;

trait Conversion_Center_Controls_Trait {

	protected $border_width_range = [
		'min' => 0,
		'max' => 10,
		'step' => 1,
	];

	protected function add_html_tag_control( string $name, string $default = 'h2' ): void {
		$this->add_control(
			$name,
			[
				'label' => esc_html__( 'HTML Tag', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'h1' => 'H1',
					'h2' => 'H2',
					'h3' => 'H3',
					'h4' => 'H4',
					'h5' => 'H5',
					'h6' => 'H6',
					'div' => 'div',
					'span' => 'span',
					'p' => 'p',
				],
				'default' => $default,
			]
		);
	}

	protected function add_images_per_row_control(
		string $name = 'icons_per_row',
		$options = [
			'2' => '2',
			'3' => '3',
		],
		string $default = '3',
		$label = ''
	): void {
		if ( ! $label ) {
			$label = esc_html__( 'Icons Per Row', 'elementor' );
		}
		$this->add_control(
			$name,
			[
				'label' => $label,
				'type' => Controls_Manager::SELECT,
				'options' => $options,
				'default' => $default,
			]
		);
	}

	protected function add_slider_control(
		string $name,
		array $args = []
	): void {
		$default_args = [
			'type' => Controls_Manager::SLIDER,
			'default' => [
				'unit' => 'px',
			],
			'size_units' => [ 'px', '%', 'em', 'rem', 'vw', 'custom' ],
			'range' => [
				'px' => [
					'min' => 0,
					'max' => 100,
					'step' => 1,
				],
			],
		];

		$this->add_control(
			$name,
			array_merge_recursive( $default_args, $args )
		);
	}

	protected function add_borders_control(
		string $prefix,
		array $show_border_args = [],
		array $border_width_args = [],
		array $border_color_args = []
	): void {
		$show_border = [
			'label' => esc_html__( 'Border', 'elementor' ),
			'type' => Controls_Manager::SWITCHER,
			'label_on' => esc_html__( 'Yes', 'elementor' ),
			'label_off' => esc_html__( 'No', 'elementor' ),
			'return_value' => 'yes',
			'default' => '',
		];

		$this->add_control(
			$prefix . '_show_border',
			array_merge( $show_border, $show_border_args )
		);

		$condition = [
			$prefix . '_show_border' => 'yes',
		];

		if ( isset( $border_width_args['condition'] ) ) {
			$condition = array_merge( $condition, $border_width_args['condition'] );
			unset( $border_width_args['condition'] );
		}

		$border_width = [
			'label' => esc_html__( 'Border Width', 'elementor' ) . ' (px)',
			'type' => Controls_Manager::SLIDER,
			'size_units' => [ 'px' ],
			'range' => [
				'px' => $this->border_width_range,
			],
			'condition' => $condition,
		];

		$this->add_control(
			$prefix . '_border_width',
			array_merge( $border_width, $border_width_args ),
		);

		$condition = [
			$prefix . '_show_border' => 'yes',
		];

		if ( isset( $border_color_args['condition'] ) ) {
			$condition = array_merge( $condition, $border_color_args['condition'] );
			unset( $border_color_args['condition'] );
		}

		$border_color = [
			'label' => esc_html__( 'Border Color', 'elementor' ),
			'type' => Controls_Manager::COLOR,
			'condition' => $condition,
		];

		$this->add_control(
			$prefix . '_border_color',
			array_merge( $border_color, $border_color_args )
		);
	}
}
