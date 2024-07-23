<?php

namespace Elementor\Modules\FloatingBars\Classes\Render;

use Elementor\Modules\FloatingBars\Base\Widget_Floating_Bars_Base;

/**
 * Class Floating_Bars_Render_Base.
 *
 * This is the base class that will hold shared functionality that will be needed by all the various widget versions.
 *
 * @since 3.23.0
 */
abstract class Floating_Bars_Render_Base {

	protected Widget_Floating_Bars_Base $widget;

	protected array $settings;

	abstract public function render(): void;

	public function __construct( Widget_Floating_Bars_Base $widget ) {
		$this->widget = $widget;
		$this->settings = $widget->get_settings_for_display();
	}

	protected function add_layout_render_attribute( $layout_classnames ) {
		$this->widget->add_render_attribute( 'layout', [
			'class' => $layout_classnames,
			'id' => $this->settings['advanced_custom_css_id'],
			'data-document-id' => get_the_ID(),
			'role' => 'alertdialog'
		] );
	}

	protected function build_layout_render_attribute(): void {
		$layout_classnames = 'e-floating-bars e-' . $this->widget->get_name();
		$vertical_position = $this->settings['advanced_vertical_position'];
		$is_sticky = $this->settings['advanced_toggle_sticky'];
		$has_close_button = $this->settings['floating_bar_close_switch'];

		$layout_classnames .= ' has-vertical-position-' . $vertical_position;

		if ( 'yes' === $has_close_button ) {
			$layout_classnames .= ' has-close-button';
		}
		
		if ( 'yes' === $is_sticky ) {
			$layout_classnames .= ' is-sticky';
		}

		$this->add_layout_render_attribute( $layout_classnames );
	}
}
