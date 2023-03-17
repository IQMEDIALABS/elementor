<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Group_Control_Grid_Container extends Group_Control_Base {

	protected static $fields;

	public static function get_type() {
		return 'grid-container';
	}

	protected function init_fields() {
		$fields = [];

		$fields['items_grid'] = [
			'type' => Controls_Manager::HEADING,
			'label' => esc_html__( 'Grid Items', 'elementor' ),
			'separator' => 'before',
		];

		$fields['columns_grid'] = [
			'label' => esc_html__( 'Columns', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'range' => [
				'fr' => [
					'min' => 1,
					'max' => 12,
					'step' => 1,
				],
			],
			'size_units' => [ 'fr' ],
			'default' => [
				'unit' => 'fr',
				'size' => 3,
			],
			'selectors' => [
				'{{SELECTOR}}' => '--e-con-grid-template-columns: repeat({{SIZE}}, 1fr)',
			],
			'responsive' => true,
		];

		$fields['rows_grid'] = [
			'label' => esc_html__( 'Rows', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'range' => [
				'fr' => [
					'min' => 1,
					'max' => 12,
					'step' => 1,
				],
			],
			'size_units' => [ 'fr' ],
			'default' => [
				'unit' => 'fr',
				'size' => 2,
			],
			'selectors' => [
				'{{SELECTOR}}' => '--e-con-grid-template-rows: repeat({{SIZE}}, 1fr)',
			],
			'responsive' => true,
		];
		
		$fields['justify_items'] = [
			'label' => esc_html_x( 'Justify Items', 'Grid Container Control', 'elementor' ),
			'type' => Controls_Manager::CHOOSE,
			'options' => [
				'start' => [
					'title' => esc_html_x( 'Start', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-start-v',
				],
				'center' => [
					'title' => esc_html_x( 'Center', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-center-v',
				],
				'end' => [
					'title' => esc_html_x( 'End', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-end-v',
				],
				'stretch' => [
					'title' => esc_html_x( 'Stretch', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-stretch-v',
				],
			],
			'default' => '',
			'selectors' => [
				'{{SELECTOR}}' => '--justify-items: {{VALUE}};',
			],
			'responsive' => true,
		];

		$fields['align_items'] = [
			'label' => esc_html_x( 'Align Items', 'Grid Container Control', 'elementor' ),
			'type' => Controls_Manager::CHOOSE,
			'options' => [
				'start' => [
					'title' => esc_html_x( 'Start', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-start-h',
				],
				'center' => [
					'title' => esc_html_x( 'Center', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-center-h',
				],
				'end' => [
					'title' => esc_html_x( 'End', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-end-h',
				],
				'stretch' => [
					'title' => esc_html_x( 'Stretch', 'Grid Container Control', 'elementor' ),
					'icon' => 'eicon-flex eicon-align-stretch-h',
				],
			],
			'selectors' => [
				'{{SELECTOR}}' => '--align-items: {{VALUE}};',
			],
			'responsive' => true,
		];

		return $fields;
	}

	protected function get_default_options() {
		return [
			'popover' => false,
		];
	}
}
