<?php
namespace Elementor\Modules\NestedAccordion;

use Elementor\Plugin;
use Elementor\Core\Base\Module as BaseModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends BaseModule {

	public static function is_active() {
		return Plugin::$instance->experiments->is_feature_active( 'nested-elements' );
	}

	public function get_name() {
		return 'nested-accordion';
	}

	public function __construct() {
		parent::__construct();

		add_action( 'elementor/editor/before_enqueue_scripts', function () {
			wp_enqueue_script( $this->get_name(), $this->get_js_assets_url( $this->get_name() ), [
				'nested-elements',
			], ELEMENTOR_VERSION, true );
		} );

		add_action( 'elementor/frontend/enqueue_widgets', [ $this, 'enqueue_widget_stylesheet' ] );
	}

	/**
	 * Enqueue the stylesheet for this widget.
	 *
	 * @return void
	 */
	public function enqueue_widget_stylesheet(): void {
		wp_enqueue_style(
			$this->get_name(),
			$this->get_css_assets_url( 'frontend', 'assets/css/modules/nested-accordion/' ),
			[],
			ELEMENTOR_VERSION
		);
	}
}
