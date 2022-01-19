<?php

namespace Elementor\Modules\ContainerConverter;

use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends \Elementor\Core\Base\Module {

	// Event name dispatched by the buttons.
	const EVENT_NAME = 'elementorContainerConverter:convert';

	/**
	 * Retrieve the module name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'container-converter';
	}

	/**
	 * Determine whether the module is active.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return Plugin::$instance->experiments->is_feature_active( 'container' );
	}

	/**
	 * Enqueue the module scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			'container-converter',
			$this->get_js_assets_url( 'container-converter' ),
			[ 'elementor-editor' ],
			ELEMENTOR_VERSION,
			true
		);
	}

	/**
	 * Add a convert button to sections.
	 *
	 * @param \Elementor\Controls_Stack $controls_stack
	 *
	 * @return void
	 */
	protected function add_section_convert_button( Controls_Stack $controls_stack ) {
		if ( ! Plugin::$instance->editor->is_edit_mode() ) {
			return;
		}

		$controls_stack->start_injection( [
			'of' => '_title',
		] );

		$controls_stack->add_control(
			'convert_to_container',
			[
				'type' => Controls_Manager::BUTTON,
				'label' => esc_html__( 'Convert to Container', 'elementor' ),
				'text' => esc_html__( 'Apply', 'elementor' ),
				'button_type' => 'default',
				'separator' => 'after',
				'event' => static::EVENT_NAME,
			]
		);

		$controls_stack->end_injection();
	}

	/**
	 * Add a convert button to page settings.
	 *
	 * @param \Elementor\Controls_Stack $controls_stack
	 *
	 * @return void
	 */
	protected function add_page_convert_button( Controls_Stack $controls_stack ) {
		if ( ! Plugin::$instance->editor->is_edit_mode() ) {
			return;
		}

		$controls_stack->start_injection( [
			'of' => 'post_title',
			'at' => 'before',
		] );

		$controls_stack->add_control(
			'convert_to_container',
			[
				'type' => Controls_Manager::BUTTON,
				'label' => esc_html__( 'Convert All Sections to Containers', 'elementor' ),
				'text' => esc_html__( 'Apply', 'elementor' ),
				'button_type' => 'default',
				'event' => static::EVENT_NAME,
			]
		);

		$controls_stack->end_injection();
	}

	/**
	 * Initialize the Container-Converter module.
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

		add_action( 'elementor/element/section/section_layout/after_section_end', function ( Controls_Stack $controls_stack ) {
			$this->add_section_convert_button( $controls_stack );
		} );

		add_action( 'elementor/documents/register_controls', function ( Controls_Stack $controls_stack ) {
			$this->add_page_convert_button( $controls_stack );
		} );
	}
}
