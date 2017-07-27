<?php
namespace Elementor\Modules\History;

use Elementor\Core\Base\Module as BaseModule;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Module extends BaseModule {

	public function get_name() {
		return 'history';
	}

	public function localize_settings( $settings ) {
		$settings = array_replace_recursive( $settings, [
			'i18n' => [
				'history' => __( 'History', 'elementor' ),
				'no_history_1' => __( 'History lets you undo and redo the latest actions in the panel.', 'elementor' ),
				'no_history_2' => __( 'Start designing your page and you\'ll be able to see the entire history here.', 'elementor' ),
				'added' => __( 'Added', 'elementor' ),
				'removed' => __( 'Removed', 'elementor' ),
				'edited' => __( 'Edited', 'elementor' ),
				'moved' => __( 'Moved', 'elementor' ),
				'duplicated' => __( 'Duplicated', 'elementor' ),
				'editing_started' => __( 'Editing Started', 'elementor' ),
			],
		] );
		return $settings;
	}

	public function __construct() {
		parent::__construct();

		add_filter( 'elementor/editor/localize_settings', [ $this, 'localize_settings' ] );

		Plugin::$instance->editor->add_editor_template( __DIR__ . '/views/history-panel-template.php' );
		Plugin::$instance->editor->add_editor_template( __DIR__ . '/views/revisions-panel-template.php' );
	}
}
