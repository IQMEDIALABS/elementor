<?php
namespace Elementor\Includes\Elements;

use Elementor\Controls_Manager;
use Elementor\Element_Base;
use Elementor\Embed;
use Elementor\Group_Control_Background;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;
use Elementor\Group_Control_Css_Filter;
use Elementor\Group_Control_Flex_Container;
use Elementor\Group_Control_Flex_Item;
use Elementor\Plugin;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Container extends Element_Base {

	/**
	 * Get the element type.
	 *
	 * @return string
	 */
	public static function get_type() {
		return 'container';
	}

	/**
	 * Get the element name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'container';
	}

	/**
	 * Get the element display name.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Container', 'elementor' );
	}

	/**
	 * Get the element display icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-container';
	}

	/**
	 * Override the render attributes to add a custom wrapper class.
	 *
	 * @return void
	 */
	protected function add_render_attributes() {
		parent::add_render_attributes();

		$this->add_render_attribute( '_wrapper', [
			'class' => [
				'e-container',
			],
		] );
	}

	/**
	 * Override the initial element config to display the Container in the panel.
	 *
	 * @return array
	 */
	protected function get_initial_config() {
		$config = parent::get_initial_config();

		$config['controls'] = $this->get_controls();
		$config['tabs_controls'] = $this->get_tabs_controls();
		$config['show_in_panel'] = true;
		$config['categories'] = [ 'basic' ];

		return $config;
	}

	/**
	 * Render the element JS template.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
		<#
		if ( settings.background_video_link ) {
			let videoAttributes = 'autoplay muted playsinline';

			if ( ! settings.background_play_once ) {
				videoAttributes += ' loop';
			}

			view.addRenderAttribute( 'background-video-container', 'class', 'elementor-background-video-container' );

			if ( ! settings.background_play_on_mobile ) {
				view.addRenderAttribute( 'background-video-container', 'class', 'elementor-hidden-phone' );
			}
			#>
			<div {{{ view.getRenderAttributeString( 'background-video-container' ) }}}>
				<div class="elementor-background-video-embed"></div>
				<video class="elementor-background-video-hosted elementor-html5-video" {{ videoAttributes }}></video>
			</div>
		<# } #>
		<?php
	}

	/**
	 * Render the video background markup.
	 *
	 * @return void
	 */
	private function render_video_background() {
		$settings = $this->get_settings_for_display();

		if ( 'video' !== $settings['background_background'] ) {
			return;
		}

		if ( ! $settings['background_video_link'] ) {
			return;
		}

		$video_properties = Embed::get_video_properties( $settings['background_video_link'] );

		$this->add_render_attribute( 'background-video-container', 'class', 'elementor-background-video-container' );

		if ( ! $settings['background_play_on_mobile'] ) {
			$this->add_render_attribute( 'background-video-container', 'class', 'elementor-hidden-phone' );
		}

		?>
		<div <?php $this->print_render_attribute_string( 'background-video-container' ); ?>>
			<?php if ( $video_properties ) : ?>
				<div class="elementor-background-video-embed"></div>
				<?php
			else :
				$video_tag_attributes = 'autoplay muted playsinline';

				if ( 'yes' !== $settings['background_play_once'] ) {
					$video_tag_attributes .= ' loop';
				}
				?>
				<video class="elementor-background-video-hosted elementor-html5-video" <?php echo esc_attr( $video_tag_attributes ); ?>></video>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Print safe HTML tag for the element based on the element settings.
	 *
	 * @return void
	 */
	private function print_html_tag() {
		$html_tag = $this->get_settings( 'html_tag' );

		if ( empty( $html_tag ) ) {
			$html_tag = 'div';
		}

		Utils::print_validated_html_tag( $html_tag );
	}

	/**
	 * Before rendering the container content. (Print the opening tag, etc.)
	 *
	 * @return void
	 */
	public function before_render() {
		?>
		<<?php $this->print_html_tag(); ?>  <?php $this->print_render_attribute_string( '_wrapper' ); ?>>
		<?php
		$this->render_video_background();
	}

	/**
	 * After rendering the Container content. (Print the closing tag, etc.)
	 *
	 * @return void
	 */
	public function after_render() {
		?>
		</<?php $this->print_html_tag(); ?> >
		<?php
	}

	/**
	 * Override the default child type to allow widgets & containers as children.
	 *
	 * @param array $element_data
	 *
	 * @return \Elementor\Element_Base|\Elementor\Widget_Base|null
	 */
	protected function _get_default_child_type( array $element_data ) {
		if ( 'container' === $element_data['elType'] ) {
			return Plugin::$instance->elements_manager->get_element_types( 'container' );
		}

		return Plugin::$instance->widgets_manager->get_widget_types( $element_data['widgetType'] );
	}

	/**
	 * Register the Container's layout controls.
	 *
	 * @return void
	 */
	protected function register_container_layout_controls() {
		$this->start_controls_section(
			'section_layout_container',
			[
				'label' => esc_html__( 'Container', 'elementor' ),
				'tab' => Controls_Manager::TAB_LAYOUT,
			]
		);

		$this->add_control(
			'container_type',
			[
				'type' => Controls_Manager::HIDDEN,
				'default' => 'flex',
				'selectors' => [
					'{{WRAPPER}}' => '--display: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'layout',
			[
				'label' => esc_html__( 'Content Width', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'boxed',
				'options' => [
					'full-width' => esc_html__( 'Full Width', 'elementor' ),
					'boxed' => esc_html__( 'Boxed', 'elementor' ),
				],
				'selectors_dictionary' => [
					'full-width' => '100%',
					'boxed' => 'var( --container-max-width, 1140px )', // Default same as section.
				],
				'selectors' => [
					'{{WRAPPER}}' => '--max-width: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'content_width',
			[
				'label' => esc_html__( 'Width', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 500,
						'max' => 1600,
					],
				],
				'selectors' => [
					'{{WRAPPER}}' => '--max-width: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'layout' => [ 'boxed' ],
				],
				'separator' => 'none',
			]
		);

		$this->add_responsive_control(
			'height',
			[
				'label' => esc_html__( 'Height', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => esc_html__( 'Default', 'elementor' ),
					'full' => esc_html__( 'Fit To Screen', 'elementor' ),
					'min-height' => esc_html__( 'Min Height', 'elementor' ),
				],
				'selectors_dictionary' => [
					'full' => '100vh',
					'min-height' => '',
				],
				'selectors' => [
					'{{WRAPPER}}' => '--height: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'custom_height',
			[
				'label' => esc_html__( 'Minimum Height', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 400,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1440,
					],
					'vh' => [
						'min' => 0,
						'max' => 100,
					],
					'vw' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'size_units' => [ 'px', 'vh', 'vw' ],
				'selectors' => [
					'{{WRAPPER}}' => '--min-height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'height' => [ 'min-height' ],
				],
			]
		);

		$this->add_group_control(
			Group_Control_Flex_Container::get_type(),
			[
				'name' => 'flex',
				'selector' => '{{WRAPPER}}',
				'fields_options' => [
					'gap' => [
						'label' => esc_html_x( 'Spacing', 'Flex Item Control', 'elementor' ),
					],
					'direction' => [
						'default' => 'column',
					],
				],
				'condition' => [
					'container_type' => 'flex',
				],
			]
		);

		$this->register_children_layout_controls();

		$this->add_control(
			'overflow',
			[
				'label' => esc_html__( 'Overflow', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'separator' => 'before',
				'default' => '',
				'options' => [
					'' => esc_html__( 'Default', 'elementor' ),
					'hidden' => esc_html__( 'Hidden', 'elementor' ),
				],
				'selectors' => [
					'{{WRAPPER}}' => '--overflow: {{VALUE}}',
				],
			]
		);

		$possible_tags = [
			'div' => 'div',
			'header' => 'header',
			'footer' => 'footer',
			'main' => 'main',
			'article' => 'article',
			'section' => 'section',
			'aside' => 'aside',
			'nav' => 'nav',
		];

		$options = [
			'' => esc_html__( 'Default', 'elementor' ),
		] + $possible_tags;

		$this->add_responsive_control(
			'html_tag',
			[
				'label' => esc_html__( 'HTML Tag', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => $options,
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the Container's flex items layout controls.
	 *
	 * @return void
	 */
	protected function register_children_layout_controls() {
		$this->add_control(
			'flex_children_heading',
			[
				'label' => esc_html__( 'Flex Children', 'elementor' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_group_control(
			Group_Control_Flex_Item::get_type(),
			[
				'name' => 'children_flex',
				'exclude' => [
					'align_self',
					'order',
				],
				'selector' => '{{WRAPPER}} > *',
			]
		);
	}

	/**
	 * Register the Container's layout tab.
	 *
	 * @return void
	 */
	protected function register_layout_tab() {
		$this->register_container_layout_controls();
	}

	/**
	 * Register the Container's background controls.
	 *
	 * @return void
	 */
	protected function register_background_controls() {
		$this->start_controls_section(
			'section_background',
			[
				'label' => esc_html__( 'Background', 'elementor' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->start_controls_tabs( 'tabs_background' );

		/**
		 * Normal.
		 */
		$this->start_controls_tab(
			'tab_background_normal',
			[
				'label' => esc_html__( 'Normal', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'types' => [ 'classic', 'gradient', 'video', 'slideshow' ],
				'fields_options' => [
					'background' => [
						'frontend_available' => true,
					],
				],
			]
		);

		$this->end_controls_tab();

		/**
		 * Hover.
		 */
		$this->start_controls_tab(
			'tab_background_hover',
			[
				'label' => esc_html__( 'Hover', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background_hover',
				'selector' => '{{WRAPPER}}:hover',
			]
		);

		$this->add_control(
			'background_hover_transition',
			[
				'label' => esc_html__( 'Transition Duration', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0.3,
				],
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'render_type' => 'ui',
				'separator' => 'before',
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();
	}

	/**
	 * Register the Container's background overlay controls.
	 *
	 * @return void
	 */
	protected function register_background_overlay_controls() {
		$this->start_controls_section(
			'section_background_overlay',
			[
				'label' => esc_html__( 'Background Overlay', 'elementor' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->start_controls_tabs( 'tabs_background_overlay' );

		/**
		 * Normal.
		 */
		$this->start_controls_tab(
			'tab_background_overlay',
			[
				'label' => esc_html__( 'Normal', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background_overlay',
				'selector' => '{{WRAPPER}}::before',
			]
		);

		$this->add_control(
			'background_overlay_opacity',
			[
				'label' => esc_html__( 'Opacity', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => .5,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'step' => 0.01,
					],
				],
				'selectors' => [
					'{{WRAPPER}}' => '--overlay-opacity: {{SIZE}};',
				],
				'condition' => [
					'background_overlay_background' => [ 'classic', 'gradient' ],
				],
			]
		);

		$this->add_group_control(
			Group_Control_Css_Filter::get_type(),
			[
				'name' => 'css_filters',
				'selector' => '{{WRAPPER}}::before',
				'conditions' => [
					'relation' => 'or',
					'terms' => [
						[
							'name' => 'background_overlay_image[url]',
							'operator' => '!==',
							'value' => '',
						],
						[
							'name' => 'background_overlay_color',
							'operator' => '!==',
							'value' => '',
						],
					],
				],
			]
		);

		$this->add_control(
			'overlay_blend_mode',
			[
				'label' => esc_html__( 'Blend Mode', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => esc_html__( 'Normal', 'elementor' ),
					'multiply' => esc_html__( 'Multiply', 'elementor' ),
					'screen' => esc_html__( 'Screen', 'elementor' ),
					'overlay' => esc_html__( 'Overlay', 'elementor' ),
					'darken' => esc_html__( 'Darken', 'elementor' ),
					'lighten' => esc_html__( 'Lighten', 'elementor' ),
					'color-dodge' => esc_html__( 'Color Dodge', 'elementor' ),
					'saturation' => esc_html__( 'Saturation', 'elementor' ),
					'color' => esc_html__( 'Color', 'elementor' ),
					'luminosity' => esc_html__( 'Luminosity', 'elementor' ),
				],
				'selectors' => [
					'{{WRAPPER}}' => '--overlay-mix-blend-mode: {{VALUE}}',
				],
				'conditions' => [
					'relation' => 'or',
					'terms' => [
						[
							'name' => 'background_overlay_image[url]',
							'operator' => '!==',
							'value' => '',
						],
						[
							'name' => 'background_overlay_color',
							'operator' => '!==',
							'value' => '',
						],
					],
				],
			]
		);

		$this->end_controls_tab();

		/**
		 * Hover.
		 */
		$this->start_controls_tab(
			'tab_background_overlay_hover',
			[
				'label' => esc_html__( 'Hover', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background_overlay_hover',
				'selector' => '{{WRAPPER}}:hover::before',
			]
		);

		$this->add_control(
			'background_overlay_hover_opacity',
			[
				'label' => esc_html__( 'Opacity', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => .5,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'step' => 0.01,
					],
				],
				'selectors' => [
					'{{WRAPPER}}:hover' => '--overlay-opacity: {{SIZE}};',
				],
				'condition' => [
					'background_overlay_hover_background' => [ 'classic', 'gradient' ],
				],
			]
		);

		$this->add_group_control(
			Group_Control_Css_Filter::get_type(),
			[
				'name' => 'css_filters_hover',
				'selector' => '{{WRAPPER}}:hover::before',
			]
		);

		$this->add_control(
			'background_overlay_hover_transition',
			[
				'label' => esc_html__( 'Transition Duration', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0.3,
				],
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'render_type' => 'ui',
				'separator' => 'before',
				'selectors' => [
					'{{WRAPPER}}' => '--overlay-transition: {{SIZE}}s;',
				],
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();
	}

	/**
	 * Register the Container's border controls.
	 *
	 * @return void
	 */
	protected function register_border_controls() {
		$this->start_controls_section(
			'section_border',
			[
				'label' => esc_html__( 'Border', 'elementor' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->start_controls_tabs( 'tabs_border' );

		/**
		 * Normal.
		 */
		$this->start_controls_tab(
			'tab_border',
			[
				'label' => esc_html__( 'Normal', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
			]
		);

		$this->add_responsive_control(
			'border_radius',
			[
				'label' => esc_html__( 'Border Radius', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}}' => '--border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow',
			]
		);

		$this->end_controls_tab();

		/**
		 * Hover.
		 */
		$this->start_controls_tab(
			'tab_border_hover',
			[
				'label' => esc_html__( 'Hover', 'elementor' ),
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border_hover',
				'selector' => '{{WRAPPER}}:hover',
			]
		);

		$this->add_responsive_control(
			'border_radius_hover',
			[
				'label' => esc_html__( 'Border Radius', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}}:hover' => '--border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow_hover',
				'selector' => '{{WRAPPER}}:hover',
			]
		);

		$this->add_control(
			'border_hover_transition',
			[
				'label' => esc_html__( 'Transition Duration', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'separator' => 'before',
				'default' => [
					'size' => 0.3,
				],
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'conditions' => [
					'relation' => 'or',
					'terms' => [
						[
							'name' => 'background_background',
							'operator' => '!==',
							'value' => '',
						],
						[
							'name' => 'border_border',
							'operator' => '!==',
							'value' => '',
						],
					],
				],
				'selectors' => [
					'{{WRAPPER}}' => '--transition: background {{background_hover_transition.SIZE}}s, border {{SIZE}}s, border-radius {{SIZE}}s, box-shadow {{SIZE}}s;
						--overlay-transition: background {{background_overlay_hover_transition.SIZE}}s, border-radius {{SIZE}}s, opacity {{background_overlay_hover_transition.SIZE}}s',
				],
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();
	}

	/**
	 * Register the Container's style tab.
	 *
	 * @return void
	 */
	protected function register_style_tab() {
		$this->register_background_controls();

		$this->register_background_overlay_controls();

		$this->register_border_controls();
	}

	/**
	 * Register the Container's advanced style controls.
	 *
	 * @return void
	 */
	protected function register_advanced_controls() {
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => esc_html__( 'Advanced', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => esc_html__( 'Margin', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%', 'rem' ],
				'selectors' => [
					'{{WRAPPER}}' => '--margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'padding',
			[
				'label' => esc_html__( 'Padding', 'elementor' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%', 'rem' ],
				'default' => [
					'unit' => 'px',
					'top' => 10,
					'right' => 10,
					'bottom' => 10,
					'left' => 10,
				],
				'selectors' => [
					'{{WRAPPER}}' => '--padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'z_index',
			[
				'label' => esc_html__( 'Z-Index', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'min' => 0,
				'selectors' => [
					'{{WRAPPER}}' => '--z-index: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'_element_id',
			[
				'label' => esc_html__( 'CSS ID', 'elementor' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'dynamic' => [
					'active' => true,
				],
				'title' => esc_html__( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'elementor' ),
				'style_transfer' => false,
				'classes' => 'elementor-control-direction-ltr',
			]
		);

		$this->add_control(
			'css_classes',
			[
				'label' => esc_html__( 'CSS Classes', 'elementor' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'dynamic' => [
					'active' => true,
				],
				'prefix_class' => '',
				'title' => esc_html__( 'Add your custom class WITHOUT the dot. e.g: my-class', 'elementor' ),
				'classes' => 'elementor-control-direction-ltr',
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the Container's flex child controls.
	 *
	 * @return void
	 */
	protected function register_flex_child_controls() {
		$this->start_controls_section(
			'section_flex',
			[
				'label' => esc_html__( 'Flex', 'elementor' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_group_control(
			Group_Control_Flex_Item::get_type(),
			[
				'name' => '_flex',
				'selector' => '{{WRAPPER}}.e-container', // Hack to increase specificity.
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the Container's motion effects controls.
	 *
	 * @return void
	 */
	protected function register_motion_effects_controls() {
		$this->start_controls_section(
			'section_effects',
			[
				'label' => esc_html__( 'Motion Effects', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'animation',
			[
				'label' => esc_html__( 'Entrance Animation', 'elementor' ),
				'type' => Controls_Manager::ANIMATION,
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'animation_duration',
			[
				'label' => esc_html__( 'Animation Duration', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'slow' => esc_html__( 'Slow', 'elementor' ),
					'' => esc_html__( 'Normal', 'elementor' ),
					'fast' => esc_html__( 'Fast', 'elementor' ),
				],
				'prefix_class' => 'animated-',
				'condition' => [
					'animation!' => '',
				],
			]
		);

		$this->add_control(
			'animation_delay',
			[
				'label' => esc_html__( 'Animation Delay', 'elementor' ) . ' (ms)',
				'type' => Controls_Manager::NUMBER,
				'default' => '',
				'min' => 0,
				'step' => 100,
				'condition' => [
					'animation!' => '',
				],
				'render_type' => 'none',
				'frontend_available' => true,
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register the Container's responsive controls.
	 *
	 * @return void
	 */
	protected function register_responsive_controls() {
		$this->start_controls_section(
			'_section_responsive',
			[
				'label' => esc_html__( 'Responsive', 'elementor' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'heading_visibility',
			[
				'label' => esc_html__( 'Visibility', 'elementor' ),
				'type' => Controls_Manager::HEADING,
			]
		);

		$this->add_control(
			'responsive_description',
			[
				'raw' => esc_html__( 'Responsive visibility will take effect only on preview or live page, and not while editing in Elementor.', 'elementor' ),
				'type' => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
			]
		);

		$this->add_hidden_device_controls();

		$this->end_controls_section();
	}

	/**
	 * Register the Container's advanced tab.
	 *
	 * @return void
	 */
	protected function register_advanced_tab() {
		$this->register_advanced_controls();

		$this->register_flex_child_controls();

		$this->register_motion_effects_controls();

		$this->register_responsive_controls();

		Plugin::$instance->controls_manager->add_custom_attributes_controls( $this );

		Plugin::$instance->controls_manager->add_custom_css_controls( $this );
	}

	/**
	 * Register the Container's controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->register_layout_tab();
		$this->register_style_tab();
		$this->register_advanced_tab();
	}
}
