<?php
namespace Elementor\Includes\Base;

use Elementor\Plugin;
use Elementor\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

abstract class Widget_Repeater_Base extends Widget_Base {

	protected function get_initial_config() {
		$result = parent::get_initial_config();

		$result['support_repeater_elements'] = true;

		return $result;
	}

	protected function _get_default_child_type( array $element_data ) {
		if ( ! empty( $element_data['widgetType'] ) ) {
			Plugin::$instance->widgets_manager->get_widget_types( $element_data['widgetType'] );
		}

		return Plugin::$instance->elements_manager->get_element_types( $element_data['elType'] );
	}

	public function get_raw_data( $with_html_content = false ) {
		$elements = [];
		$data = $this->get_data();

		$children = $this->get_children();

		foreach ( $children as $child ) {
			$child_raw_data = $child->get_raw_data( $with_html_content );

			$elements[] = $child_raw_data;
		}

		return [
			'id' => $this->get_id(),
			'elType' => $data['elType'],
			'widgetType' => $data['widgetType'],
			'settings' => $data['settings'],
			'isInner' => $data['isInner'],
			'elements' => $elements,
		];
	}

	public function print_children( $index ) {
		$children = $this->get_children();

		if ( ! empty( $children[ $index ] ) ) {
			$children[ $index ]->print_element();
		}
	}
}
