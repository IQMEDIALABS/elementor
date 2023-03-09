<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor gap control.
 *
 * A base control for creating gap control. Displays input fields for two values,
 * row/column, hight/width/ and the option to link them together.
 *
 * @since 3.13.0
 */

class Control_Gap extends Control_Dimensions {
	/**
	 * Get gap control type.
	 *
	 * Retrieve the control type, in this case `gap`.
	 *
	 * @since 3.13.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'gap';
	}

	/**
	 * Get gap control default values.
	 *
	 * Retrieve the default value of the gap control. Used to return the default
	 * values while initializing the gap control.
	 *
	 * @since 3.13.0
	 * @access public
	 *
	 * @return array Control default value.
	 */
	public function get_default_value() {
		return array_merge(
			parent::get_default_value(), [
				'row' => '',
				'column' => '',
				'isLinked' => true,
			]
		);
	}

	public function get_single_name() {
		return 'gap';
	}

	protected function dimensions() {
		return [
			'row' => esc_html__( 'Row', 'elementor' ),
			'column' => esc_html__( 'Column', 'elementor' ),
		];
	}
}
