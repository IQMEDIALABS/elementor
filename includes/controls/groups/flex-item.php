<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Group_Control_Flex_Item extends Group_Control_Base {

	protected static $fields;

	public static function get_type() {
		return 'flex-item';
	}

	protected function init_fields() {
		$fields = [];

		$fields['flex_basis_type'] = [
			'label' => esc_html_x( 'Flex Basis', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::SELECT,
			'options' => [
				'' => esc_html_x( 'Auto / Default', 'Flex Item Control', 'elementor' ),
				'custom' => esc_html_x( 'Custom', 'Flex Item Control', 'elementor' ),
			],
			'responsive' => true,
		];

		$fields['flex_basis'] = [
			'label' => esc_html_x( 'Custom Width', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'range' => [
				'px' => [
					'min' => 0,
					'max' => 1000,
				],
				'%' => [
					'min' => 0,
					'max' => 100,
				],
				'vw' => [
					'min' => 0,
					'max' => 100,
				],
			],
			'default' => [
				'unit' => '%',
			],
			'size_units' => [ 'px', '%', 'vw' ],
			'selectors' => [
				'{{SELECTOR}}' => '--flex-basis: {{SIZE}}{{UNIT}};',
			],
			'condition' => [
				'flex_basis_type' => 'custom',
			],
			'responsive' => true,
		];

		$fields['flex_size'] = [
			'label' => esc_html_x( 'Size', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::CHOOSE,
			'default' => '',
			'options' => [
				'none' => [
					'title' => esc_html_x( 'None', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-ban',
				],
				'grow' => [
					'title' => esc_html_x( 'Grow', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-flex-grow',
				],
				'shrink' => [
					'title' => esc_html_x( 'Shrink', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-h-align-center',
				],
				'custom' => [
					'title' => esc_html_x( 'Custom', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-ellipsis-v',
				],
			],
			'selectors_dictionary' => [
				'grow' => '--flex-grow: 1; --flex-shrink: 0;',
				'shrink' => '--flex-grow: 0; --flex-shrink: 1;',
				'custom' => '',
				'none' => '--flex-grow: 0; --flex-shrink: 0;',
			],
			'selectors' => [
				'{{SELECTOR}}' => '{{VALUE}};',
			],
			'responsive' => true,
		];

		$fields['flex_grow'] = [
			'label' => esc_html_x( 'Flex Grow', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::NUMBER,
			'selectors' => [
				'{{SELECTOR}}' => '--flex-grow: {{VALUE}};',
			],
			'default' => 1,
			'placeholder' => 1,
			'responsive' => true,
			'condition' => [
				'flex_size' => 'custom',
			],
		];

		$fields['flex_shrink'] = [
			'label' => esc_html_x( 'Flex Shrink', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::NUMBER,
			'selectors' => [
				'{{SELECTOR}}' => '--flex-shrink: {{VALUE}};',
			],
			'default' => 1,
			'placeholder' => 1,
			'responsive' => true,
			'condition' => [
				'flex_size' => 'custom',
			],
		];

		$fields['align_self'] = [
			'label' => esc_html_x( 'Align Self', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::CHOOSE,
			'options' => [
				'flex-start' => [
					'title' => esc_html_x( 'Flex Start', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-flex-align-start',
				],
				'center' => [
					'title' => esc_html_x( 'Center', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-flex-align-center',
				],
				'flex-end' => [
					'title' => esc_html_x( 'Flex End', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-flex-align-end',
				],
				'stretch' => [
					'title' => esc_html_x( 'Stretch', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-flex-align-stretch',
				],
			],
			'default' => '',
			'selectors' => [
				'{{SELECTOR}}' => '--align-self: {{VALUE}};',
			],
			'responsive' => true,
		];

		$fields['order'] = [
			'label' => esc_html_x( 'Order', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::CHOOSE,
			'default' => '',
			'options' => [
				'start' => [
					'title' => esc_html_x( 'Start', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-h-align-left',
				],
				'end' => [
					'title' => esc_html_x( 'End', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-h-align-right',
				],
				'custom' => [
					'title' => esc_html_x( 'Custom', 'Flex Item Control', 'elementor' ),
					'icon' => 'eicon-ellipsis-v',
				],
			],
			'selectors_dictionary' => [
				// Hacks to set the order to start / end.
				// For example, if the user has 10 widgets, but wants to set the 5th one to be first,
				// this hack should do the trick while taking in account elements with `order: 0` or less.
				'start' => '-99999 /* order start hack */',
				'end' => '99999 /* order end hack */',
				'custom' => '',
			],
			'selectors' => [
				'{{SELECTOR}}' => '--order: {{VALUE}};',
			],
			'responsive' => true,
		];

		$fields['order_custom'] = [
			'label' => esc_html_x( 'Order', 'Flex Item Control', 'elementor' ),
			'type' => Controls_Manager::NUMBER,
			'selectors' => [
				'{{SELECTOR}}' => '--order: {{VALUE}};',
			],
			'responsive' => true,
			'condition' => [
				'order' => 'custom',
			],
		];

		return $fields;
	}

	protected function get_default_options() {
		return [
			'popover' => false,
		];
	}
}
