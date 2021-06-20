<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor common widget.
 *
 * Elementor base widget that gives you all the advanced options of the basic
 * widget.
 *
 * @since 1.0.0
 */
class Widget_Common extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve common widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'common';
	}

	/**
	 * Show in panel.
	 *
	 * Whether to show the common widget in the panel or not.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return bool Whether to show the widget in the panel.
	 */
	public function show_in_panel() {
		return false;
	}

	/**
	 * @param $shape String Shape name.
	 *
	 * @return string The shape path in the assets folder.
	 */
	private function get_shape_url( $shape ) {
		return ELEMENTOR_ASSETS_URL . 'mask-shapes/' . $shape . '.svg';
	}

	/**
	 * @param bool $add_custom Determine if the output should contain `Custom` options.
	 *
	 * @return array Array of shapes with their URL as key.
	 */
	private function get_shapes( $add_custom = true ) {
		$shapes = [
			'circle' => __( 'Circle', 'elementor' ),
			'flower' => __( 'Flower', 'elementor' ),
			'sketch' => __( 'Sketch', 'elementor' ),
			'triangle' => __( 'Triangle', 'elementor' ),
			'blob' => __( 'Blob', 'elementor' ),
			'hexagon' => __( 'Hexagon', 'elementor' ),
		];

		if ( $add_custom ) {
			$shapes['custom'] = __( 'Custom', 'elementor' );
		}

		return $shapes;
	}

	/**
	 * Get array of selectors and rules to deal with image masking and mask the image instead of the wrapper.
	 *
	 * @param $rules string The CSS rules to apply.
	 *
	 * @return array Selectors with the rules applied.
	 */
	private function get_mask_selectors( $rules ) {
		$mask_selectors = [
			'default' => '{{WRAPPER}}:not( .elementor-widget-image ) .elementor-widget-container',
			'image' => '{{WRAPPER}}.elementor-widget-image .elementor-widget-container img',
		];

		return [
			$mask_selectors['default'] => $rules,
			$mask_selectors['image'] => $rules,
		];
	}

	/**
	 * Register common widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 3.1.0
	 * @access protected
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'_section_style',
			[
				'label' => __( 'Advanced', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		// Element Name for the Navigator
		$this->add_control(
			'_title',
			[
				'label' => __( 'Title', 'elementor' ),
				'type' => Controls_Manager::HIDDEN,
				'render_type' => 'none',
			]
		);

		$this->add_responsive_control(
			'_margin',
			[
				'label' => __( 'Margin', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%', 'rem' ],
				'selectors' => [
					'{{WRAPPER}} > .elementor-widget-container' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'_padding',
			[
				'label' => __( 'Padding', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%', 'rem' ],
				'selectors' => [
					'{{WRAPPER}} > .elementor-widget-container' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'_z_index',
			[
				'label' => __( 'Z-Index', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'min' => 0,
				'selectors' => [
					'{{WRAPPER}}' => 'z-index: {{VALUE}};',
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'_element_id',
			[
				'label' => __( 'CSS ID', 'elementor' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
				],
				'default' => '',
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'elementor' ),
				'style_transfer' => false,
				'classes' => 'elementor-control-direction-ltr',
			]
		);

		$this->add_control(
			'_css_classes',
			[
				'label' => __( 'CSS Classes', 'elementor' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
				],
				'prefix_class' => '',
				'title' => __( 'Add your custom class WITHOUT the dot. e.g: my-class', 'elementor' ),
				'classes' => 'elementor-control-direction-ltr',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_effects',
			[
				'label' => __( 'Motion Effects', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'_animation',
			[
				'label' => __( 'Entrance Animation', 'elementor' ),
				'type' => Controls_Manager::ANIMATION,
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'animation_duration',
			[
				'label' => __( 'Animation Duration', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'slow' => __( 'Slow', 'elementor' ),
					'' => __( 'Normal', 'elementor' ),
					'fast' => __( 'Fast', 'elementor' ),
				],
				'prefix_class' => 'animated-',
				'condition' => [
					'_animation!' => '',
				],
			]
		);

		$this->add_control(
			'_animation_delay',
			[
				'label' => __( 'Animation Delay', 'elementor' ) . ' (ms)',
				'type' => Controls_Manager::NUMBER,
				'default' => '',
				'min' => 0,
				'step' => 100,
				'condition' => [
					'_animation!' => '',
				],
				'render_type' => 'none',
				'frontend_available' => true,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_background',
			[
				'label' => __( 'Background', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->start_controls_tabs( '_tabs_background' );

		$this->start_controls_tab(
			'_tab_background_normal',
			[
				'label' => __( 'Normal', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => '_background',
				'selector' => '{{WRAPPER}} > .elementor-widget-container',
			]
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'_tab_background_hover',
			[
				'label' => __( 'Hover', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => '_background_hover',
				'selector' => '{{WRAPPER}}:hover .elementor-widget-container',
			]
		);

		$this->add_control(
			'_background_hover_transition',
			[
				'label' => __( 'Transition Duration', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'render_type' => 'ui',
				'separator' => 'before',
				'selectors' => [
					'{{WRAPPER}} > .elementor-widget-container' => 'transition: background {{SIZE}}s',
				],
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_border',
			[
				'label' => __( 'Border', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->start_controls_tabs( '_tabs_border' );

		$this->start_controls_tab(
			'_tab_border_normal',
			[
				'label' => __( 'Normal', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => '_border',
				'selector' => '{{WRAPPER}} > .elementor-widget-container',
			]
		);

		$this->add_responsive_control(
			'_border_radius',
			[
				'label' => __( 'Border Radius', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .elementor-widget-container' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => '_box_shadow',
				'selector' => '{{WRAPPER}} > .elementor-widget-container',
			]
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'_tab_border_hover',
			[
				'label' => __( 'Hover', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => '_border_hover',
				'selector' => '{{WRAPPER}}:hover .elementor-widget-container',
			]
		);

		$this->add_responsive_control(
			'_border_radius_hover',
			[
				'label' => __( 'Border Radius', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}}:hover > .elementor-widget-container' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => '_box_shadow_hover',
				'selector' => '{{WRAPPER}}:hover .elementor-widget-container',
			]
		);

		$this->add_control(
			'_border_hover_transition',
			[
				'label' => __( 'Transition Duration', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'separator' => 'before',
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .elementor-widget-container' => 'transition: background {{_background_hover_transition.SIZE}}s, border {{SIZE}}s, border-radius {{SIZE}}s, box-shadow {{SIZE}}s',
				],
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_masking',
			[
				'label' => __( 'Mask', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'_mask_switch',
			[
				'label' => __( 'Mask', 'elementor' ),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __( 'On', 'elementor' ),
				'label_off' => __( 'Off', 'elementor' ),
				'default' => '',
			]
		);

		$this->add_control( '_mask_shape', [
			'label' => __( 'Shape', 'elementor' ),
			'type' => Controls_Manager::SELECT,
			'options' => $this->get_shapes(),
			'default' => 'circle',
			'selectors' => $this->get_mask_selectors( '-webkit-mask-image: url( ' . ELEMENTOR_ASSETS_URL . '/mask-shapes/{{VALUE}}.svg );' ),
			'condition' => [
				'_mask_switch!' => '',
			],
		] );

		$this->add_control(
			'_mask_image',
			[
				'label' => __( 'Image', 'elementor' ),
				'type' => Controls_Manager::MEDIA,
				'media_type' => 'image',
				'should_include_svg_inline_option' => true,
				'library_type' => 'image/svg+xml',
				'dynamic' => [
					'active' => true,
				],
				'selectors' => $this->get_mask_selectors( '-webkit-mask-image: url( {{URL}} );' ),
				'condition' => [
					'_mask_switch!' => '',
					'_mask_shape' => 'custom',
				],
			]
		);

		$this->add_control(
			'_mask_notice',
			[
				'type' => Controls_Manager::HIDDEN,
				'raw' => __( 'Need More Shapes?', 'elementor' ) . '<br>' . sprintf( __( 'Explore additional Premium Shape packs and use them in your site. <a target="_blank" href="%s">Learn More</a>', 'elementor' ), 'https://go.elementor.com/mask-control' ),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
				'condition' => [
					'_mask_switch!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_mask_size',
			[
				'label' => __( 'Size', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'contain' => __( 'Fit', 'elementor' ),
					'cover' => __( 'Fill', 'elementor' ),
					'custom' => __( 'Custom', 'elementor' ),
				],
				'default' => 'contain',
				'selectors' => $this->get_mask_selectors( '-webkit-mask-size: {{VALUE}};' ),
				'condition' => [
					'_mask_switch!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_mask_size_scale',
			[
				'label' => __( 'Scale', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%', 'vw' ],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 500,
					],
					'em' => [
						'min' => 0,
						'max' => 100,
					],
					'%' => [
						'min' => 0,
						'max' => 200,
					],
					'vw' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default' => [
					'unit' => '%',
					'size' => 100,
				],
				'selectors' => $this->get_mask_selectors( '-webkit-mask-size: {{SIZE}}{{UNIT}};' ),
				'condition' => [
					'_mask_switch!' => '',
					'_mask_size' => 'custom',
				],
			]
		);

		$this->add_responsive_control(
			'_mask_position',
			[
				'label' => __( 'Position', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'center center' => __( 'Center Center', 'elementor' ),
					'center left' => __( 'Center Left', 'elementor' ),
					'center right' => __( 'Center Right', 'elementor' ),
					'top center' => __( 'Top Center', 'elementor' ),
					'top left' => __( 'Top Left', 'elementor' ),
					'top right' => __( 'Top Right', 'elementor' ),
					'bottom center' => __( 'Bottom Center', 'elementor' ),
					'bottom left' => __( 'Bottom Left', 'elementor' ),
					'bottom right' => __( 'Bottom Right', 'elementor' ),
					'custom' => __( 'Custom', 'elementor' ),
				],
				'default' => 'center center',
				'selectors' => $this->get_mask_selectors( '-webkit-mask-position: {{VALUE}};' ),
				'condition' => [
					'_mask_switch!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_mask_position_x',
			[
				'label' => __( 'X Position', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%', 'vw' ],
				'range' => [
					'px' => [
						'min' => -500,
						'max' => 500,
					],
					'em' => [
						'min' => -100,
						'max' => 100,
					],
					'%' => [
						'min' => -100,
						'max' => 100,
					],
					'vw' => [
						'min' => -100,
						'max' => 100,
					],
				],
				'default' => [
					'unit' => '%',
					'size' => 0,
				],
				'selectors' => $this->get_mask_selectors( '-webkit-mask-position-x: {{SIZE}}{{UNIT}};' ),
				'condition' => [
					'_mask_switch!' => '',
					'_mask_position' => 'custom',
				],
			]
		);

		$this->add_responsive_control(
			'_mask_position_y',
			[
				'label' => __( 'Y Position', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%', 'vw' ],
				'range' => [
					'px' => [
						'min' => -500,
						'max' => 500,
					],
					'em' => [
						'min' => -100,
						'max' => 100,
					],
					'%' => [
						'min' => -100,
						'max' => 100,
					],
					'vw' => [
						'min' => -100,
						'max' => 100,
					],
				],
				'default' => [
					'unit' => '%',
					'size' => 0,
				],
				'selectors' => $this->get_mask_selectors( '-webkit-mask-position-y: {{SIZE}}{{UNIT}};' ),
				'condition' => [
					'_mask_switch!' => '',
					'_mask_position' => 'custom',
				],
			]
		);

		$this->add_responsive_control(
			'_mask_repeat',
			[
				'label' => __( 'Repeat', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'no-repeat' => __( 'No-Repeat', 'elementor' ),
					'repeat' => __( 'Repeat', 'elementor' ),
					'repeat-x' => __( 'Repeat-X', 'elementor' ),
					'repeat-Y' => __( 'Repeat-Y', 'elementor' ),
					'round' => __( 'Round', 'elementor' ),
					'space' => __( 'Space', 'elementor' ),
				],
				'default' => 'no-repeat',
				'selectors' => $this->get_mask_selectors( '-webkit-mask-repeat: {{VALUE}};' ),
				'condition' => [
					'_mask_switch!' => '',
					'_mask_size!' => 'cover',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_position',
			[
				'label' => __( 'Positioning', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'_element_width',
			[
				'label' => __( 'Width', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'elementor' ),
					'inherit' => __( 'Full Width', 'elementor' ) . ' (100%)',
					'auto' => __( 'Inline', 'elementor' ) . ' (auto)',
					'initial' => __( 'Custom', 'elementor' ),
				],
				'selectors_dictionary' => [
					'inherit' => '100%',
				],
				'prefix_class' => 'elementor-widget%s__width-',
				'selectors' => [
					'{{WRAPPER}}' => 'width: {{VALUE}}; max-width: {{VALUE}}',
				],
			]
		);

		$this->add_responsive_control(
			'_element_custom_width',
			[
				'label' => __( 'Custom Width', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'max' => 1000,
						'step' => 1,
					],
					'%' => [
						'max' => 100,
						'step' => 1,
					],
				],
				'condition' => [
					'_element_width' => 'initial',
				],
				'device_args' => [
					Controls_Stack::RESPONSIVE_TABLET => [
						'condition' => [
							'_element_width_tablet' => [ 'initial' ],
						],
					],
					Controls_Stack::RESPONSIVE_MOBILE => [
						'condition' => [
							'_element_width_mobile' => [ 'initial' ],
						],
					],
				],
				'size_units' => [ 'px', '%', 'vw' ],
				'selectors' => [
					'{{WRAPPER}}' => 'width: {{SIZE}}{{UNIT}}; max-width: {{SIZE}}{{UNIT}}',
				],
			]
		);

		$this->add_responsive_control(
			'_element_vertical_align',
			[
				'label' => __( 'Vertical Align', 'elementor' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'flex-start' => [
						'title' => __( 'Start', 'elementor' ),
						'icon' => 'eicon-v-align-top',
					],
					'center' => [
						'title' => __( 'Center', 'elementor' ),
						'icon' => 'eicon-v-align-middle',
					],
					'flex-end' => [
						'title' => __( 'End', 'elementor' ),
						'icon' => 'eicon-v-align-bottom',
					],
				],
				'condition' => [
					'_element_width!' => '',
					'_position' => '',
				],
				'selectors' => [
					'{{WRAPPER}}' => 'align-self: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'_position_description',
			[
				'raw' => '<strong>' . __( 'Please note!', 'elementor' ) . '</strong> ' . __( 'Custom positioning is not considered best practice for responsive web design and should not be used too frequently.', 'elementor' ),
				'type' => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-warning',
				'render_type' => 'ui',
				'condition' => [
					'_position!' => '',
				],
			]
		);

		$this->add_control(
			'_position',
			[
				'label' => __( 'Position', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'elementor' ),
					'absolute' => __( 'Absolute', 'elementor' ),
					'fixed' => __( 'Fixed', 'elementor' ),
				],
				'prefix_class' => 'elementor-',
				'frontend_available' => true,
			]
		);

		$start = is_rtl() ? __( 'Right', 'elementor' ) : __( 'Left', 'elementor' );
		$end = ! is_rtl() ? __( 'Right', 'elementor' ) : __( 'Left', 'elementor' );

		$this->add_control(
			'_offset_orientation_h',
			[
				'label' => __( 'Horizontal Orientation', 'elementor' ),
				'type' => Controls_Manager::CHOOSE,
				'toggle' => false,
				'default' => 'start',
				'options' => [
					'start' => [
						'title' => $start,
						'icon' => 'eicon-h-align-left',
					],
					'end' => [
						'title' => $end,
						'icon' => 'eicon-h-align-right',
					],
				],
				'classes' => 'elementor-control-start-end',
				'render_type' => 'ui',
				'condition' => [
					'_position!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_offset_x',
			[
				'label' => __( 'Offset', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => -1000,
						'max' => 1000,
						'step' => 1,
					],
					'%' => [
						'min' => -200,
						'max' => 200,
					],
					'vw' => [
						'min' => -200,
						'max' => 200,
					],
					'vh' => [
						'min' => -200,
						'max' => 200,
					],
				],
				'default' => [
					'size' => '0',
				],
				'size_units' => [ 'px', '%', 'vw', 'vh' ],
				'selectors' => [
					'body:not(.rtl) {{WRAPPER}}' => 'left: {{SIZE}}{{UNIT}}',
					'body.rtl {{WRAPPER}}' => 'right: {{SIZE}}{{UNIT}}',
				],
				'condition' => [
					'_offset_orientation_h!' => 'end',
					'_position!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_offset_x_end',
			[
				'label' => __( 'Offset', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => -1000,
						'max' => 1000,
						'step' => 0.1,
					],
					'%' => [
						'min' => -200,
						'max' => 200,
					],
					'vw' => [
						'min' => -200,
						'max' => 200,
					],
					'vh' => [
						'min' => -200,
						'max' => 200,
					],
				],
				'default' => [
					'size' => '0',
				],
				'size_units' => [ 'px', '%', 'vw', 'vh' ],
				'selectors' => [
					'body:not(.rtl) {{WRAPPER}}' => 'right: {{SIZE}}{{UNIT}}',
					'body.rtl {{WRAPPER}}' => 'left: {{SIZE}}{{UNIT}}',
				],
				'condition' => [
					'_offset_orientation_h' => 'end',
					'_position!' => '',
				],
			]
		);

		$this->add_control(
			'_offset_orientation_v',
			[
				'label' => __( 'Vertical Orientation', 'elementor' ),
				'type' => Controls_Manager::CHOOSE,
				'toggle' => false,
				'default' => 'start',
				'options' => [
					'start' => [
						'title' => __( 'Top', 'elementor' ),
						'icon' => 'eicon-v-align-top',
					],
					'end' => [
						'title' => __( 'Bottom', 'elementor' ),
						'icon' => 'eicon-v-align-bottom',
					],
				],
				'render_type' => 'ui',
				'condition' => [
					'_position!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_offset_y',
			[
				'label' => __( 'Offset', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => -1000,
						'max' => 1000,
						'step' => 1,
					],
					'%' => [
						'min' => -200,
						'max' => 200,
					],
					'vh' => [
						'min' => -200,
						'max' => 200,
					],
					'vw' => [
						'min' => -200,
						'max' => 200,
					],
				],
				'size_units' => [ 'px', '%', 'vh', 'vw' ],
				'default' => [
					'size' => '0',
				],
				'selectors' => [
					'{{WRAPPER}}' => 'top: {{SIZE}}{{UNIT}}',
				],
				'condition' => [
					'_offset_orientation_v!' => 'end',
					'_position!' => '',
				],
			]
		);

		$this->add_responsive_control(
			'_offset_y_end',
			[
				'label' => __( 'Offset', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => -1000,
						'max' => 1000,
						'step' => 1,
					],
					'%' => [
						'min' => -200,
						'max' => 200,
					],
					'vh' => [
						'min' => -200,
						'max' => 200,
					],
					'vw' => [
						'min' => -200,
						'max' => 200,
					],
				],
				'size_units' => [ 'px', '%', 'vh', 'vw' ],
				'default' => [
					'size' => '0',
				],
				'selectors' => [
					'{{WRAPPER}}' => 'bottom: {{SIZE}}{{UNIT}}',
				],
				'condition' => [
					'_offset_orientation_v' => 'end',
					'_position!' => '',
				],
			]
		);

		$this->start_controls_tabs( '_tabs_positioning' );

		foreach ( [ 'normal', 'hover' ] as $tab ) {
			$this->start_controls_tab(
				"_tab_positioning_{$tab}",
				[
					'label' => __( ucfirst( $tab ), 'elementor' ),
				]
			);

			$this->add_control(
				"_{$tab}_transform_rotate_popover",
				[
					'label' => __( 'Rotate', 'elementor' ),
					'type' => Controls_Manager::POPOVER_TOGGLE,
					'prefix_class' => 'elementor-',
					'return_value' => 'transform',
				]
			);

			$this->start_popover();

			$this->add_responsive_control(
				"_{$tab}_transform_rotateZ_effect",
				[
					'label' => __( 'Rotate', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => -360,
							'max' => 360,
						],
					],
					'default' => [
						'size' => 0,
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-rotate-z: {{SIZE}}deg",
					],
					'condition' => [
						"_{$tab}_transform_rotate_popover!" => '',
					],
					'frontend_available' => true,
				]
			);

			$this->add_control(
				"_{$tab}_transform_rotate_3d",
				[
					'label' => __( '3D Rotate', 'elementor' ),
					'type' => Controls_Manager::SWITCHER,
					'label_on' => __( 'On', 'elementor' ),
					'label_off' => __( 'Off', 'elementor' ),
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_rotateX_effect",
				[
					'label' => __( 'Rotate X', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => -360,
							'max' => 360,
						],
					],
					'default' => [
						'size' => 0,
					],
					'condition' => [
						"_{$tab}_transform_rotate_3d!" => '',
						"_{$tab}_transform_rotate_popover!" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-rotate-x: {{SIZE}}deg;",
					],
					'frontend_available' => true,
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_rotateY_effect",
				[
					'label' => __( 'Rotate Y', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => -360,
							'max' => 360,
						],
					],
					'default' => [
						'size' => 0,
					],
					'condition' => [
						"_{$tab}_transform_rotate_3d!" => '',
						"_{$tab}_transform_rotate_popover!" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-rotate-y: {{SIZE}}deg;",
					],
					'frontend_available' => true,
				]
			);

			$this->end_popover();

			$this->add_control(
				"_{$tab}_transform_translate_popover",
				[
					'label' => __( 'Offset', 'elementor' ),
					'type' => Controls_Manager::POPOVER_TOGGLE,
					'prefix_class' => 'elementor-',
					'return_value' => 'transform',
				]
			);

			$this->start_popover();

			$this->add_responsive_control(
				"_{$tab}_transform_translateX_effect",
				[
					'label' => __( 'Offset X', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'size_units' => [ '%', 'px' ],
					'range' => [
						'%' => [
							'min' => -200,
							'max' => 200,
						],
						'px' => [
							'min' => -3000,
							'max' => 3000,
						],
					],
					'default' => [
						'size' => 0,
					],
					'condition' => [
						"_{$tab}_transform_translate_popover!" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-translate-x: {{SIZE}}{{UNIT}};",
					],
					'frontend_available' => true,
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_translateY_effect",
				[
					'label' => __( 'Offset Y', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'size_units' => [ '%', 'px' ],
					'range' => [
						'%' => [
							'min' => -200,
							'max' => 200,
						],
						'px' => [
							'min' => -3000,
							'max' => 3000,
						],
					],
					'condition' => [
						"_{$tab}_transform_translate_popover!" => '',
					],
					'default' => [
						'size' => 0,
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-translate-y: {{SIZE}}{{UNIT}};",
					],
					'frontend_available' => true,
				]
			);

			$this->end_popover();

			$this->add_control(
				"_{$tab}_transform_scale_popover",
				[
					'label' => __( 'Scale', 'elementor' ),
					'type' => Controls_Manager::POPOVER_TOGGLE,
					'prefix_class' => 'elementor-',
					'return_value' => 'transform',
				]
			);

			$this->start_popover();

			$this->add_control(
				"_{$tab}_transform_keep_proportions",
				[
					'label' => __( 'Keep Proportions', 'elementor' ),
					'type' => Controls_Manager::SWITCHER,
					'label_on' => __( 'On', 'elementor' ),
					'label_off' => __( 'Off', 'elementor' ),
					'default' => 'yes',
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_scale_effect",
				[
					'label' => __( 'Scale', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => 0,
							'max' => 2,
							'step' => 0.1,
						],
					],
					'condition' => [
						"_{$tab}_transform_scale_popover!" => '',
						"_{$tab}_transform_keep_proportions!" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-scale: {{SIZE}};",
					],
					'frontend_available' => true,
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_scaleX_effect",
				[
					'label' => __( 'Scale X', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => 0,
							'max' => 2,
							'step' => 0.1,
						],
					],
					'condition' => [
						"_{$tab}_transform_scale_popover!" => '',
						"_{$tab}_transform_keep_proportions" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-scale-x: {{SIZE}};",
					],
					'frontend_available' => true,
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_scaleY_effect",
				[
					'label' => __( 'Scale Y', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => 0,
							'max' => 2,
							'step' => 0.1,
						],
					],
					'condition' => [
						"_{$tab}_transform_scale_popover!" => '',
						"_{$tab}_transform_keep_proportions" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-scale-y: {{SIZE}};",
					],
					'frontend_available' => true,
				]
			);

			$this->end_popover();

			$this->add_control(
				"_{$tab}_transform_skew_popover",
				[
					'label' => __( 'Skew', 'elementor' ),
					'type' => Controls_Manager::POPOVER_TOGGLE,
					'prefix_class' => 'elementor-',
					'return_value' => 'transform',
				]
			);

			$this->start_popover();

			$this->add_responsive_control(
				"_{$tab}_transform_skewX_effect",
				[
					'label' => __( 'Skew X', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => -360,
							'max' => 360,
						],
					],
					'default' => [
						'size' => 0,
					],
					'condition' => [
						"_{$tab}_transform_skew_popover!" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-skew-x: {{SIZE}}deg;",
					],
					'frontend_available' => true,
				]
			);

			$this->add_responsive_control(
				"_{$tab}_transform_skewY_effect",
				[
					'label' => __( 'Skew Y', 'elementor' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'min' => -360,
							'max' => 360,
						],
					],
					'default' => [
						'size' => 0,
					],
					'condition' => [
						"_{$tab}_transform_skew_popover!" => '',
					],
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-skew-y: {{SIZE}}deg;",
					],
					'frontend_available' => true,
				]
			);

			$this->end_popover();

			$this->add_control(
				"_{$tab}_transform_flip_horizontal_effect",
				[
					'label' => __( 'Flip Horizontal', 'elementor' ),
					'type' => Controls_Manager::CHOOSE,
					'options' => [
						'transform' => [
							'title' => __( 'Flip Horizontal', 'elementor' ),
							'icon' => 'fa fa-align-left',
						],
					],
					'prefix_class' => 'elementor-',
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-flip-x: -1",
					],
					'frontend_available' => true,
				]
			);

			$this->add_control(
				"_{$tab}_transform_flip_vertical_effect",
				[
					'label' => __( 'Flip Vertical', 'elementor' ),
					'type' => Controls_Manager::CHOOSE,
					'options' => [
						'transform' => [
							'title' => __( 'Flip Vertical', 'elementor' ),
							'icon' => 'fa fa-align-center',
						],
					],
					'prefix_class' => 'elementor-',
					'selectors' => [
						'{{WRAPPER}} > .elementor-widget-container' => "--{$tab}-flip-y: -1",
					],
					'frontend_available' => true,
				]
			);

			if ( 'hover' === $tab ) {
				$this->add_control(
					"_hover_transform_transition",
					[
						'label' => __( 'Transition Duration (ms)', 'elementor' ),
						'type' => Controls_Manager::SLIDER,
						'range' => [
							'px' => [
								'min' => 100,
								'max' => 20000,
							],
						],
						'selectors' => [
							'{{WRAPPER}} > .elementor-widget-container' => "--transition-duration: {{SIZE}}ms",
						],
					]
				);
			}

			$this->end_controls_tab();
		}

		$this->end_controls_tabs();

		// will override motion effect transform-origin
		$this->add_responsive_control(
			'_transform_x_anchor_point',
			[
				'label' => __( 'X Anchor Point', 'elementor' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'elementor' ),
						'icon' => 'eicon-h-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'elementor' ),
						'icon' => 'eicon-h-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'elementor' ),
						'icon' => 'eicon-h-align-right',
					],
				],
				'separator' => 'before',
				// 'default' => 'center',
				// 'toggle' => false,
				// 'selectors' => [
				// 	'{{WRAPPER}} > .elementor-widget-container' => '--transform-origin-x: {{VALUE}}',
				// ],
			]
		);

		$this->add_responsive_control(
			'_transform_y_anchor_point',
			[
				'label' => __( 'Y Anchor Point', 'elementor' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'top' => [
						'title' => __( 'Top', 'elementor' ),
						'icon' => 'eicon-v-align-top',
					],
					'center' => [
						'title' => __( 'Center', 'elementor' ),
						'icon' => 'eicon-v-align-middle',
					],
					'bottom' => [
						'title' => __( 'Bottom', 'elementor' ),
						'icon' => 'eicon-v-align-bottom',
					],
				],
				// 'toggle' => false,
				// 'default' => 'center',
				'selectors' => [
					// '{{WRAPPER}} > .elementor-widget-container' => '--transform-origin-y: {{VALUE}}',
					'{{WRAPPER}} > .elementor-widget-container' => 'transform-origin: {{_transform_x_anchor_point.VALUE}} {{VALUE}}',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_responsive',
			[
				'label' => __( 'Responsive', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'responsive_description',
			[
				'raw' => __( 'Responsive visibility will take effect only on preview or live page, and not while editing in Elementor.', 'elementor' ),
				'type' => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
			]
		);

		$this->add_control(
			'hide_desktop',
			[
				'label' => __( 'Hide On Desktop', 'elementor' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'elementor-',
				'label_on' => 'Hide',
				'label_off' => 'Show',
				'return_value' => 'hidden-desktop',
			]
		);

		$this->add_control(
			'hide_tablet',
			[
				'label' => __( 'Hide On Tablet', 'elementor' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'elementor-',
				'label_on' => 'Hide',
				'label_off' => 'Show',
				'return_value' => 'hidden-tablet',
			]
		);

		$this->add_control(
			'hide_mobile',
			[
				'label' => __( 'Hide On Mobile', 'elementor' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'elementor-',
				'label_on' => 'Hide',
				'label_off' => 'Show',
				'return_value' => 'hidden-phone',
			]
		);

		$this->end_controls_section();

		Plugin::$instance->controls_manager->add_custom_attributes_controls( $this );

		Plugin::$instance->controls_manager->add_custom_css_controls( $this );
	}
}
