<?php
namespace Elementor\Core\Editor\Templates;

use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$notice = Plugin::$instance->editor->notice_bar->get_notice();
?>

<header id="elementor-editor-wrapper-v2" aria-label="<?php echo esc_attr__( 'Top Bar', 'elementor' ); ?>"></header>

<div id="elementor-editor-wrapper">
	<aside id="elementor-panel" class="elementor-panel" aria-labelledby="elementor-panel-header-title"></aside>
	<main id="elementor-preview" aria-label="<?php echo esc_attr__( 'Preview', 'elementor' ); ?>">
		<div id="elementor-loading">
			<div class="elementor-loader-wrapper">
				<div class="elementor-loader" aria-hidden="true">
					<div class="elementor-loader-boxes">
						<div class="elementor-loader-box"></div>
						<div class="elementor-loader-box"></div>
						<div class="elementor-loader-box"></div>
						<div class="elementor-loader-box"></div>
					</div>
				</div>
				<div class="elementor-loading-title"><?php echo esc_html__( 'Loading', 'elementor' ); ?></div>
			</div>
		</div>
		<div id="elementor-preview-responsive-wrapper" class="elementor-device-desktop elementor-device-rotate-portrait">
			<div id="elementor-preview-loading">
				<i class="eicon-loading eicon-animation-spin" aria-hidden="true"></i>
			</div>
			<?php if ( $notice ) {
				$notice->render();
			} // IFrame will be created here by the Javascript later. ?>
		</div>
	</main>
	<aside id="elementor-navigator" aria-labelledby="elementor-navigator__header__title"></aside>
</div>
