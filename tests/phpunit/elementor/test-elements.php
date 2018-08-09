<?php
namespace Elementor\Testing;

use \Elementor\Plugin;

class Elementor_Test_Elements extends Elementor_Test_Base {

	public function test_getInstance() {
		$this->assertInstanceOf( '\Elementor\Elements_Manager', Plugin::$instance->elements_manager );
	}

	public function test_getElements() {
		$this->assertNotEmpty( Plugin::$instance->elements_manager->get_element_types() );
	}

	public function test_elementMethods() {
		foreach ( Plugin::$instance->elements_manager->get_element_types() as $element ) {
			$this->assertNotEmpty( $element->get_title() );
			$this->assertNotEmpty( $element->get_type() );
			$this->assertNotEmpty( $element->get_name() );
		}
	}

	public function test_registerNUnregisterElement() {
		$element_class = '\Elementor\Element_Column';
		$element_id = 'column';

		$this->assertTrue( Plugin::$instance->elements_manager->register_element_type( new $element_class( [ 'id' => $element_id ] ) ) );

		$element = Plugin::$instance->elements_manager->get_element_types( $element_id );
		$this->assertInstanceOf( $element_class, $element );

		$this->assertTrue( Plugin::$instance->elements_manager->unregister_element_type( $element_id ) );
		$this->assertFalse( Plugin::$instance->elements_manager->unregister_element_type( $element_id ) );

		$this->assertNull( Plugin::$instance->elements_manager->get_element_types( $element_id ) );

		$this->assertTrue( Plugin::$instance->elements_manager->register_element_type( new $element_class( [ 'id' => $element_id ] ) ) );
	}

	/**
	 * @expectedIncorrectUsage Elementor\Controls_Manager::add_control_to_stack
	 */
	public function test_redeclareControl() {
		$element_obj = Plugin::$instance->elements_manager->get_element_types( 'section' );

		$control_id = 'test_redeclare_control';
		$element_obj->add_control( $control_id, [ 'section' => 'section_layout' ] );
		$element_obj->add_control( $control_id, [ 'section' => 'section_layout' ] );
		$element_obj->remove_control( $control_id );
	}

	public function test_controlsSelectorsData() {
		foreach ( Plugin::$instance->elements_manager->get_element_types() as $element ) {
			foreach ( $element->get_controls() as $control ) {
				if ( empty( $control['selectors'] ) ) {
					continue;
				}

				foreach ( $control['selectors'] as $selector => $css_property ) {
					foreach ( explode( ',', $selector ) as $item ) {
						preg_match( '/\{\{(WRAPPER)|(ID)\}\}/', $item, $matches );

						$this->assertTrue( ! ! $matches );
					}
				}
			}
		}
	}

	public function test_controlsDefaultData() {
		foreach ( Plugin::$instance->elements_manager->get_element_types() as $element ) {
			foreach ( $element->get_controls() as $control ) {
				if ( \Elementor\Controls_Manager::SELECT !== $control['type'] ) {
					continue;
				}

				$error_msg = sprintf( 'Element: %1$s, Control: %2$s', $element->get_name(), $control['name'] );

				if ( empty( $control['default'] ) ) {
					$this->assertTrue( isset( $control['options'][''] ), $error_msg );
				} else {
					$flat_options = [];

					if ( isset( $control['groups'] ) ) {
						foreach ( $control['groups'] as $index_or_key => $args_or_label ) {
							if ( is_numeric( $index_or_key ) ) {
								$args = $args_or_label;

								$this->assertTrue( is_array( $args['options'] ), $error_msg );

								foreach ( $args['options'] as $key => $label ) {
									$flat_options[ $key ] = $label;
								}
							} else {
								$key = $index_or_key;
								$label = $args_or_label;
								$flat_options[ $key ] = $label;
							}
						}
					} else {
						$flat_options = $control['options'];
					}

					$this->assertArrayHasKey( $control['default'], $flat_options, $error_msg );
				}
			}
		}
	}
}
