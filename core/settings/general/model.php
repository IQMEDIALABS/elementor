<?php
namespace Elementor\Core\Settings\General;

use Elementor\Controls_Manager;
use Elementor\Core\Settings\Base\Model as BaseModel;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Model extends BaseModel {

	public function get_name() {
		return 'global-settings';
	}

	public function get_css_wrapper_selector() {
		return '';
	}

	public function get_panel_page_settings() {
		return [
			'title' => __( 'General Settings', 'elementor' ),
			'menu' => [
				'icon' => 'fa fa-cog',
				'beforeItem' => 'revision-history',
			],
		];
	}

	public static function get_controls_list() {

		return [
			Manager::PANEL_TAB_GENERAL_STYLE => [
				'style' => [
					'label' => __( 'Style', 'elementor' ),
					'controls' => [
						'elementor_default_generic_fonts' => [
							'label' => __( 'Default Generic Fonts', 'elementor' ),
							'type' => Controls_Manager::TEXT,
							'default' => 'Sans-serif',
							'description' => __( 'The list of fonts used if the chosen font is not available.', 'elementor' ),
							'label_block' => true,
						],
						'elementor_container_width' => [
							'label' => __( 'Content Width', 'elementor' ) . ' (px)',
							'type' => Controls_Manager::NUMBER,
							'min' => 0,
							'description' => __( 'Sets the default width of the content area (Default: 1140)', 'elementor' ),
							'selectors' => [
								'.elementor-section.elementor-section-boxed > .elementor-container' => 'max-width: {{VALUE}}px',
							],
						],
						'elementor_space_between_widgets' => [
							'label' => __( 'Widgets Space', 'elementor' ) . ' (px)',
							'type' => Controls_Manager::NUMBER,
							'min' => 0,
							'placeholder' => '20',
							'description' => __( 'Sets the default space between widgets (Default: 20)', 'elementor' ),
							'selectors' => [
								'.elementor-widget:not(:last-child)' => 'margin-bottom: {{VALUE}}px',
							],
						],
						'elementor_stretched_section_container' => [
							'label' => __( 'Stretched Section Fit To', 'elementor' ),
							'type' => Controls_Manager::TEXT,
							'placeholder' => 'body',
							'description' => __( 'Enter parent element selector to which stretched sections will fit to (e.g. #primary / .wrapper / main etc). Leave blank to fit to page width.', 'elementor' ),
							'label_block' => true,
							'frontend_available' => true,
						],
						'elementor_page_title_selector' => [
							'label' => __( 'Page Title Selector', 'elementor' ),
							'type' => Controls_Manager::TEXT,
							'placeholder' => 'h1.entry-title',
							'description' => __( 'Elementor lets you hide the page title. This works for themes that have "h1.entry-title" selector. If your theme\'s selector is different, please enter it above.', 'elementor' ),
							'label_block' => true,
						],
					],
				],
			],
			Manager::PANEL_TAB_LIGHTBOX => [
				'lightbox_style' => [
					'label' => __( 'Style', 'elementor' ),
					'controls' => [
						'elementor_lightbox_color' => [
							'label' => __( 'Background Color', 'elementor' ),
							'type' => Controls_Manager::COLOR,
							'selectors' => [
								'.elementor-lightbox' => 'background-color: {{VALUE}}',
							],
						],
						'elementor_lightbox_content_width' => [
							'label' => __( 'Content Width', 'elementor' ),
							'type' => Controls_Manager::SLIDER,
							'units' => [ '%' ],
							'default' => [
								'unit' => '%',
							],
							'range' => [
								'%' => [
									'min' => 50,
								],
							],
							'selectors' => [
								'.elementor-lightbox .elementor-video-container' => 'width: {{SIZE}}{{UNIT}};',
							],
						],
					],
				],
				'lightbox_settings' => [
					'label' => __( 'Settings', 'elementor' ),
					'controls' => [
						'elementor_open_images_in_lightbox' => [
							'label' => __( 'Open Images In Lightbox', 'elementor' ),
							'type' => Controls_Manager::SWITCHER,
							'default' => 'yes',
							'frontend_available' => true,
						],
					],
				],
			],
		];
	}

	protected function _register_controls() {
		$controls_list = self::get_controls_list();

		foreach ( $controls_list as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				$this->start_controls_section( $section_name, [
					'label' => $section_data['label'],
					'tab' => $tab_name,
				] );

				foreach ( $section_data['controls'] as $control_name => $control_data ) {
					$this->add_control( $control_name, $control_data );
				}

				$this->end_controls_section();
			}
		}
	}
}
