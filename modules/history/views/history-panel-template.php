<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<script type="text/template" id="tmpl-elementor-panel-history-page">
	<div id="elementor-panel-elements-navigation" class="elementor-panel-navigation">
		<div class="elementor-component-tab elementor-panel-navigation-tab" data-tab="actions"><?php echo __( 'Actions', 'elementor' ); ?></div>
		<div class="elementor-component-tab elementor-panel-navigation-tab" data-tab="revisions"><?php echo __( 'Revisions', 'elementor' ); ?></div>
	</div>
	<div id="elementor-panel-history-content"></div>
</script>

<script type="text/template" id="tmpl-elementor-panel-history-tab">
	<div id="elementor-history-list"></div>
	<div class="elementor-history-revisions-message"><?php echo __( 'Switch to Revisions tab for older versions', 'elementor' ); ?></div>
</script>

<script type="text/template" id="tmpl-elementor-panel-history-no-items">
	<img class="elementor-nerd-box-icon" src="<?php echo ELEMENTOR_ASSETS_URL . 'images/information.svg'; ?>" />
	<div class="elementor-nerd-box-title"><?php echo __( 'No History Yet', 'elementor' ); ?></div>
	<div class="elementor-nerd-box-message"><?php echo __( 'Once you start working, you\'ll be able to redo / undo any action you make in the editor.', 'elementor' ); ?></div>
</script>

<script type="text/template" id="tmpl-elementor-panel-history-item">
	<div class="elementor-history-item__details">
		<span class="elementor-history-item__title">{{{ title }}}</span>
		<span class="elementor-history-item__subtitle">{{{ subTitle }}}</span>
		<span class="elementor-history-item__action">{{{ action }}}</span>
	</div>
	<div class="elementor-history-item__icon">
		<span class="eicon" aria-hidden="true"></span>
	</div>
</script>
