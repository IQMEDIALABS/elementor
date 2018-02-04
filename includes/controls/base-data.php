<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor base data control.
 *
 * A base control for creating data controls.
 *
 * @since 1.5.0
 * @abstract
 */
abstract class Base_Data_Control extends Base_Control {

	/**
	 * Get data control default value.
	 *
	 * Retrieve the default value of the data control. Used to return the default
	 * values while initializing the data control.
	 *
	 * @since 1.5.0
	 * @access public
	 *
	 * @return string Control default value.
	 */
	public function get_default_value() {
		return '';
	}

	/**
	 * Retrieve default control settings.
	 *
	 * Get the default settings of the control. Used to return the default
	 * settings while initializing the control.
	 *
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		$default_settings = parent::get_default_settings();

		$default_settings['dynamic'] = false;

		return $default_settings;
	}

	/**
	 * Get data control value.
	 *
	 * Retrieve the value of the data control from a specific widget settings.
	 *
	 * @since 1.5.0
	 * @access public
	 *
	 * @param array $control  Control
	 * @param array $settings Element settings
	 *
	 * @return mixed Control values.
	 */
	public function get_value( $control, $settings ) {
		if ( ! isset( $control['default'] ) ) {
			$control['default'] = $this->get_default_value();
		}

		if ( isset( $settings[ $control['name'] ] ) ) {
			$value = $settings[ $control['name'] ];
		} else {
			$value = $control['default'];
		}

		return $value;
	}

	public function parse_tags( $value, $dynamic_settings ) {
		if ( ! $value ) {
			return $value;
		}

		$dynamic_settings = array_merge( $this->get_settings( 'dynamic' ), $dynamic_settings );

		$value_to_parse = $value;

		$dynamic_property = ! empty( $dynamic_settings['property'] ) ? $dynamic_settings['property'] : null;

		if ( $dynamic_property ) {
			$value_to_parse = $value_to_parse[ $dynamic_property ];
		}

		$parsed_value = Plugin::$instance->dynamic_tags_manager->parse_tags_text( $value_to_parse, $dynamic_settings, [ Plugin::$instance->dynamic_tags_manager, 'get_tag_data_content' ] );

		if ( $dynamic_property ) {
			$value[ $dynamic_property ] = $parsed_value;
		} else {
			$value = $parsed_value;
		}

		return $value;
	}

	/**
	 * Get data control style value.
	 *
	 * Retrieve the style of the control. Used when adding CSS rules to the control
	 * while extracting CSS from the `selectors` data argument.
	 *
	 * @since 1.5.0
	 * @access public
	 *
	 * @param string $css_property  CSS property.
	 * @param string $control_value Control value.
	 *
	 * @return string Control style value.
	 */
	public function get_style_value( $css_property, $control_value ) {
		return $control_value;
	}

	/**
	 * Get data control unique ID.
	 *
	 * Retrieve the unique ID of the control. Used to set a uniq CSS ID for the
	 * element.
	 *
	 * @since 1.5.0
	 * @access protected
	 *
	 * @param string $input_type Input type. Default is 'default'.
	 *
	 * @return string Unique ID.
	 */
	protected function get_control_uid( $input_type = 'default' ) {
		return 'elementor-control-' . $input_type . '-{{{ data._cid }}}';
	}
}
