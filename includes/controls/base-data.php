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
	 * Retrieve data control default value.
	 *
	 * Get the default value of the data control. Used to return the default
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
	 * Retrieve data control value.
	 * Get the value of the data control from a specific widget settings.
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

		$valueToParse = $value;

		$dynamicProperty = ! empty( $dynamic_settings['property'] ) ? $dynamic_settings['property'] : null;

		if ( $dynamicProperty ) {
			$valueToParse = $valueToParse[ $dynamicProperty ];
		}

		$parsedValue = Plugin::$instance->micro_elements_manager->parse_tags_text( $valueToParse, $this->get_settings( 'dynamic' ), [ Plugin::$instance->micro_elements_manager, 'get_tag_data_content' ] );

		if ( $dynamicProperty ) {
			$value[ $dynamicProperty ] = $parsedValue;
		} else {
			$value = $parsedValue;
		}

		return $value;
	}

	/**
	 * Retrieve data control style value.
	 *
	 * Get the style of the control. Used when adding CSS rules to the control
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
	 * Retrieve data control unique ID.
	 *
	 * Get the unique ID of the control. Used to set a uniq CSS ID for the
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
