<?php

namespace Elementor\Modules\Announcements;

use Elementor\Core\Base\App as BaseApp;
use Elementor\Modules\Announcements\Classes\Announcement;
use Elementor\Settings as ElementorSettings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends BaseApp {

	/**
	 * @return bool
	 */
	public static function is_active(): bool {
		return is_admin();
	}

	/**
	 * @return string
	 */
	public function get_name(): string {
		return 'announcements';
	}

	/**
	 * Render wrapper for the app to load.
	 */
	private function render_app_wrapper() {
		?>
		<div id="e-announcements-root"></div>
		<?php
	}

	/**
	 * Enqueue app scripts.
	 */
	private function enqueue_scripts() {
		wp_enqueue_script(
			'announcements-app',
			$this->get_js_assets_url( 'announcements-app' ),
			[],
			ELEMENTOR_VERSION,
			true
		);

		$this->print_config( 'announcements-app' );
	}

	/**
	 * Get initialization settings to use in frontend.
	 *
	 * @return array[]
	 */
	protected function get_init_settings(): array {
		$active_announcements = $this->get_active_announcements();
		$additional_settings = [];

		foreach ( $active_announcements as $announcement ) {
			$additional_settings[] = $announcement->get_prepared_data();
			//@TODO - replace with ajax request from the front after actually triggered
			$announcement->after_triggered();
		}

		return [
			'announcements' => $additional_settings,
		];
	}

	/**
	 * Enqueue the module styles.
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			'announcements-app',
			$this->get_css_assets_url( 'modules/announcements/announcements' ),
			[],
			ELEMENTOR_VERSION
		);
	}

	/**
	 * Retrieve all announcement in raw format ( array ).
	 *
	 * @return array[]
	 */
	private function get_raw_announcements(): array {
		return [
			[
				'title' => 'Picture perfect: Introducing the AI image generator',
				'description' => '<p>Generate new images or edit existing ones with text to image prompts.</p>
				<ul>
					<li>Use generative fill to edit, add, or erase content in existing images or expand them beyond their original size and aspect ratio.</li>
					<li>Choose from twenty-nine preset styles that will supercharge your prompts and check out the image-prompt gallery for inspiration. </li>
					<li>Create custom code, write content, and generate images with Elementor’s comprehensive AI toolbox.</li>
				</ul>',
				'media' => [
					'type' => 'image',
					'src' => ELEMENTOR_ASSETS_URL . 'images/announcement.png?' . ELEMENTOR_VERSION,
				],
				'cta' => [
					[
						'label' => 'Continue',
						'variant' => 'primary',
						'target' => '_blank',
					],
					[
						'label' => 'Learn More',
						'target' => '_blank',
						'url' => 'https://go.elementor.com/whats-new-popup-learn-elementor-ai/',
					],
				],
				'triggers' => [
					[
						'action' => 'aiStared',
					],
				],
			],
		];
	}

	/**
	 * Retrieve all announcement objects.
	 *
	 * @return array
	 */
	private function get_announcements(): array {
		$announcements = [];
		foreach ( $this->get_raw_announcements() as $announcement_data ) {
			$announcements[] = new Announcement( $announcement_data );
		}

		return $announcements;
	}

	/**
	 * Retrieve all active announcement objects.
	 *
	 * @return array
	 */
	private function get_active_announcements(): array {
		$active_announcements = [];
		foreach ( $this->get_announcements() as $announcement ) {
			if ( $announcement->is_active() ) {
				$active_announcements[] = $announcement;
			}
		}

		return $active_announcements;
	}

	public function __construct() {
		if ( empty( $this->get_active_announcements() ) ) {
			return;
		}
		parent::__construct();

		add_action( 'elementor/editor/footer', function () {
			$this->render_app_wrapper();
		} );

		add_action( 'elementor/editor/after_enqueue_scripts', function () {
			$this->enqueue_scripts();
			$this->enqueue_styles();
		} );
	}
}
