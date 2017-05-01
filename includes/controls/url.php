<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A URL input control. with the ability to set the target of the link to `_blank` to open in a new tab.
 *
 * @param array $default {
 * 		@type string $url         Default empty
 * 		@type bool   $is_external Determine whether to open the url in the same tab or in a new one
 *                                Default empty
 * }
 *
 * @param bool  $show_external 	  Whether to show the 'Is External' button
 *                                Default true
 *
 * @since 1.0.0
 */
class Control_URL extends Control_Base_Multiple {

	public function get_type() {
		return 'url';
	}

	public function get_default_value() {
		return [
			'url' => '',
			'is_external' => '',
			'nofollow' => '',
		];
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_external' => true,
		];
	}

	public function content_template() {
		?>
		<div class="elementor-control-field elementor-control-url-external-{{{ data.show_external ? 'show' : 'hide' }}}">
			<label class="elementor-control-title">{{{ data.label }}}</label>
			<div class="elementor-control-input-wrapper">
				<input type="url" data-setting="url" placeholder="{{ data.placeholder }}" />
				<label for="elementor-control-url-more-input-{{data._cid}}" class="elementor-control-url-more tooltip-target" data-tooltip="<?php _e( 'Link Options', 'elementor' ); ?>">
					<i class="fa fa-cog"></i>
				</label>
				<input type="checkbox" id="elementor-control-url-more-input-{{data._cid}}" class="elementor-control-url-more-input">
				<div class="elementor-control-url-more-options">
					<div class="elementor-control-url-option">
						<input type="checkbox" id="elementor-control-url-option-input-is_external-{{data._cid}}" class="elementor-control-url-option-input" data-setting="is_external">
						<label for="elementor-control-url-option-input-is_external-{{data._cid}}"><?php echo __( 'Open in new window', 'elementor' ); ?></label>
					</div>
					<div class="elementor-control-url-option">
						<input type="checkbox" id="elementor-control-url-option-input-nofollow-{{data._cid}}" class="elementor-control-url-option-input" data-setting="nofollow">
						<label for="elementor-control-url-option-input-nofollow-{{data._cid}}"><?php echo __( 'Add nofollow', 'elementor' ); ?></label>
					</div>
				</div>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="elementor-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
