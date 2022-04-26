<?php

$composer_autoloader_file = __DIR__ . '/../vendor/autoload.php';

if ( ! file_exists( $composer_autoloader_file ) ) {
	die( 'Installing composer are required for running the tests.' );
}

require $composer_autoloader_file;


use Elementor\Autoloader;
use Elementor\Core\Experiments\Manager as Experiments_Manager;

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( getenv( 'WP_PHPUNIT__DIR' ) ) {
	$_tests_dir = getenv( 'WP_PHPUNIT__DIR' );
}

define( 'ELEMENTOR_TESTS', true );

/**
 * change PLUGIN_FILE env in phpunit.xml
 */
define( 'PLUGIN_FILE', getenv( 'PLUGIN_FILE' ) );
define( 'PLUGIN_FOLDER', basename( dirname( __DIR__ ) ) );
define( 'PLUGIN_PATH', PLUGIN_FOLDER . '/' . PLUGIN_FILE );

// Activates this plugin in WordPress so it can be tested.
$GLOBALS['wp_tests_options'] = [
	'active_plugins' => [ PLUGIN_PATH ],
	'template' => 'twentytwentyone',
	'stylesheet' => 'twentytwentyone',
];

require_once $_tests_dir . '/includes/functions.php';

tests_add_filter( 'muplugins_loaded', function () {
	// Manually load plugin
	require dirname( __DIR__ ) . '/' . PLUGIN_FILE;
} );

// Removes all sql tables on shutdown
// Do this action last
tests_add_filter( 'shutdown', 'drop_tables', 999999 );

require $_tests_dir . '/includes/bootstrap.php';
require __DIR__ . '/phpunit/trait-test-upgrades.php';

require_once dirname( __DIR__ ) . '/includes/autoloader.php';

require __DIR__ . '/phpunit/elementor/schemas/bootstrap.php';

Autoloader::run();

remove_action( 'admin_init', '_maybe_update_themes' );
remove_action( 'admin_init', '_maybe_update_core' );
remove_action( 'admin_init', '_maybe_update_plugins' );

// The following action activates all registered experiments in order for them to be able to be tested.
add_action( 'elementor/experiments/feature-registered', function ( Experiments_Manager $experiments_manager, array $experimental_data ) {
	$experiments_manager->set_feature_default_state( $experimental_data['name'], $experiments_manager::STATE_ACTIVE );
}, 10, 2 );

// Make sure the main class is running
\Elementor\Plugin::instance();

// Run fake actions
do_action( 'init' );
do_action( 'plugins_loaded' );

\Elementor\Plugin::$instance->init_common();
