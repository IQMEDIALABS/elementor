<?php
namespace Elementor\Testing\Core\Base;

use Elementor\Plugin;
use ElementorEditorTesting\Elementor_Test_Base;
use Elementor\Testing\Core\Base\Mock\Mock_Template;
use Elementor\Testing\Core\Base\Mock\Mock_Internal_URL;

require_once 'mock/mock-internal-url.php';
require_once 'mock/mock-template.php';

class Test_Document extends Elementor_Test_Base {

	/**
	 * @var array
	 */
	static $document_mock_default = [
		'settings' => [
			'post_status' => 'publish',
			'background_background' => 'classic',
			'background_color' => '#ffffff',
		],
		'elements' => [
			[
				'id' => 'd50d8c5',
				'elType' => 'section',
				'isInner' => false,
				'settings' => [],
				'elements' => [
					[
						'id' => 'a2e9b68',
						'elType' => 'column',
						'isInner' => false,
						'settings' => [ '_column_size' => 100 ],
						'elements' => [
							[
								'id' => '5a1e8e5',
								'elType' => 'widget',
								'settings' => [
									'style' => 'dots_tribal',
									'text' => 'Divider',
								],
								'elements' => [],
								'widgetType' => 'divider',
							],
						],
					],
				],
			],
		]
	];

	public function test_save() {
		// Arrange.
		require_once __DIR__ . '/document.php';

		$this->act_as_admin();

		$post = $this->factory()->create_and_get_default_post();

		$document = new Document( [
			'post_id' => $post->ID,
		] );

		$expected_document_settings = self::$document_mock_default['settings'];

		// The post status is not saved to the document settings in order to avoid conflicts with `wo_posts.post_status` column.
		unset( $expected_document_settings['post_status'] );

		// Act.
		$document->save( self::$document_mock_default );

		// Assert.
		$this->assertEquals( self::$document_mock_default['elements'], $document->get_elements_data() );
		$this->assertEquals( $expected_document_settings, $document->get_db_document_settings() );
	}

	/**
	 * @return void
	 * @throws \Exception
	 *
	 * Function 'on_import_replace_dynamic_content' deprecated since 3.8.0.
	 * The function 'on_import_update_ids' is used instead.
	 * TODO: Remove in the future.
	 */
	public function test_on_import_replace_dynamic_content() {
		require_once __DIR__ . '/document.php';

		$this->act_as_admin();

		Plugin::$instance->dynamic_tags->register( new Mock_Internal_URL() );

		plugin::$instance->widgets_manager->register( new Mock_Template() );

		$post = $this->factory()->create_and_get_default_post();

		$document = new Document( [
			'post_id' => $post->ID,
		] );

		$map_old_new_post_ids = [ '35' => '36', '37' => '38' ];

		$config = self::$document_mock_default[ 'elements' ];

		$dynamic_widgets = [
			[
				'id' => '233273c4',
				'elType' => 'widget',
				'settings' => [
					'__dynamic__' => [
						'link' => '[elementor-tag id="70ab2b2" name="internal-url" settings="%7B%22type%22%3A%22post%22%2C%22post_id%22%3A%2235%22%7D"]'
					],
				],
				'elements' => [],
				'widgetType' => 'button',
			],
			[
				'id' => '75341731',
				'elType' => 'widget',
				'settings' => [
					'template_id' => '37',
				],
				'elements' => [],
				'widgetType' => 'template',
			],
		];

		$config[0]['elements'][0]['elements'] = array_merge( $config[0]['elements'][0]['elements'], $dynamic_widgets );

		$updated_config = $document::on_import_replace_dynamic_content( $config, $map_old_new_post_ids );

		$this->assertEquals(
			'[elementor-tag id="70ab2b2" name="internal-url" settings="%7B%22type%22%3A%22post%22%2C%22post_id%22%3A%2236%22%7D"]',
			$updated_config[0][ 'elements' ][0][ 'elements' ][1][ 'settings' ][ '__dynamic__' ][ 'link' ]
		);

		$this->assertEquals(
			'38',
			$updated_config[0][ 'elements' ][0][ 'elements' ][2][ 'settings' ][ 'template_id' ]
		);
	}

	public function test_on_import_update_ids() {
		require_once __DIR__ . '/document.php';

		$this->act_as_admin();

		Plugin::$instance->dynamic_tags->register( new Mock_Internal_URL() );

		plugin::$instance->widgets_manager->register( new Mock_Template() );

		$post = $this->factory()->create_and_get_default_post();

		$document = new Document( [
			'post_id' => $post->ID,
		] );

		$replace_data = [
			'post_ids' => [ '35' => '36', '37' => '38' ],
			'term_ids' => [ '42' => '43' ],
		];

		$config = self::$document_mock_default[ 'elements' ];

		$widgets = [
			[
				'id' => '233273c4',
				'elType' => 'widget',
				'settings' => [
					'__dynamic__' => [
						'link' => '[elementor-tag id="70ab2b2" name="internal-url" settings="%7B%22type%22%3A%22post%22%2C%22post_id%22%3A%2235%22%7D"]',
					],
				],
				'elements' => [],
				'widgetType' => 'button',
			],
			[
				'id' => '75341731',
				'elType' => 'widget',
				'settings' => [
					'template_id' => '37',
				],
				'elements' => [],
				'widgetType' => 'template',
			],
			[
				'id' => '5a1e8e5',
				'elType' => 'widget',
				'settings' => [
					'posts_include' => [ 'terms' ],
					'posts_include_term_ids' => [ '42' ],
				],
				'elements' => [],
				'widgetType' => 'posts',
			],
		];

		$config[0]['elements'][0]['elements'] = array_merge( $config[0]['elements'][0]['elements'], $widgets );

		$updated_config = $document::on_import_update_ids( $config, $replace_data );

		$this->assertEquals(
			'[elementor-tag id="70ab2b2" name="internal-url" settings="%7B%22type%22%3A%22post%22%2C%22post_id%22%3A%2236%22%7D"]',
			$updated_config[0][ 'elements' ][0][ 'elements' ][1][ 'settings' ][ '__dynamic__' ][ 'link' ]
		);

		$this->assertEquals(
			'38',
			$updated_config[0][ 'elements' ][0][ 'elements' ][2][ 'settings' ][ 'template_id' ]
		);

		$this->assertEquals(
			'43',
			$updated_config[0][ 'elements' ][0][ 'elements' ][3][ 'settings' ][ 'posts_include_term_ids' ][0]
		);
	}

	// TODO: Full test of get_editor_panel_config.

	public function test_get_editor_panel_config_ensure_default_route() {
		$before_user = wp_get_current_user();

		// Set editor user.
		wp_set_current_user( $this->factory()->get_editor_user()->ID );

		$default_route_excepted = 'panel/elements/categories';
		$document = Plugin::$instance->documents->get( $this->factory()->create_and_get_default_post()->ID );

		query_posts( [
			'p' => $document->get_main_id(),
		] );

		the_post();

		$config = $document->get_config();

		$this->assertEquals( $default_route_excepted, $config['panel']['default_route'],
			"Ensure user without design restriction have '$default_route_excepted' as default route");

		add_filter( 'elementor/editor/user/restrictions', function( $restrictions ) {
			$restrictions['editor'] = [ 'design' ];

			return $restrictions;
		} );

		$default_route_excepted = 'panel/page-settings/settings';
		$document = Plugin::$instance->documents->get( $this->factory()->create_and_get_default_post()->ID );
		$config = $document->get_config();

		$this->assertEquals( $default_route_excepted, $config['panel']['default_route'],
			"Ensure user with design restriction have '$default_route_excepted' as default route");

		wp_set_current_user( $before_user->ID );
	}

	public function tearDown() {
		parent::tearDown();

		remove_action( 'elementor/element/section/section_layout/after_section_start', [ __CLASS__, 'add_external_control' ] );
	}
}
