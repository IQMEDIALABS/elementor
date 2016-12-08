<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Control_Select extends Control_Base {

	public function get_type() {
		return 'select';
	}

	public function content_template() {
		?>
		<div class="elementor-control-field">
			<label class="elementor-control-title">{{{ data.label }}}</label>
			<div class="elementor-control-input-wrapper">
				<select data-setting="{{ data.name }}">
				<#
				_.each( data.options, function( option_title, option_value ) {
					if( typeof option_title == 'object' ) {
						#>
							<optgroup label="{{{ option_value }}}">
						<#
						_.each( option_title, function( title, value ) {
							#>
							<option value="{{ value }}">{{{ title }}}</option>
							<#
						} );
						#>
							</optgroup>
						<#
					} else {
						#>
						<option value="{{ option_value }}">{{{ option_title }}}</option>
						<#
					}
				} );

				#>
				</select>
			</div>
		</div>
		<# if ( data.description ) { #>
			<div class="elementor-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
