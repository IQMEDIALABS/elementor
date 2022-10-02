<?php
namespace Elementor\Tests\Phpunit\Elementor\App\ImportExport;

use Elementor\App\Modules\ImportExport\Module;
use Elementor\Modules\System_Info\Reporters\Server;
use Elementor\Plugin;
use ElementorEditorTesting\Elementor_Test_Base;

class Test_Module extends Elementor_Test_Base {

	private $elementor_upload_dir;
	private $elementor_upload_dir_permission;

	public function setUp() {
		parent::setUp();

		$this->elementor_upload_dir = ( new Server() )->get_system_path( Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );
		$this->elementor_upload_dir_permission = fileperms( $this->elementor_upload_dir );
	}

	public function tearDown() {
		parent::tearDown();

		// Cleanup
		chmod( $this->elementor_upload_dir, $this->elementor_upload_dir_permission );
	}

	public function test_export_kit__fails_when_elementor_uploads_has_no_writing_permissions() {
		// Expect
		$this->expectException( \Error::class );
		$this->expectExceptionMessage( Module::NO_WRITE_PERMISSIONS_KEY . 'in - ' . Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );

		// Arrange
		$elementor_uploads_dir = ( new Server() )->get_system_path( Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );

		chmod( $elementor_uploads_dir, 0000 );

		clearstatcache();

		// Act
		( new Module() )->export_kit( [] );
	}

	public function test_upload_kit__fails_when_elementor_uploads_has_no_writing_permissions() {
		// Expect
		$this->expectException( \Error::class );
		$this->expectExceptionMessage( Module::NO_WRITE_PERMISSIONS_KEY . 'in - ' . Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );

		// Arrange
		$elementor_uploads_dir = ( new Server() )->get_system_path( Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );

		chmod( $elementor_uploads_dir, 0000 );

		clearstatcache();

		// Act
		( new Module() )->upload_kit( '', '' );
	}

	public function test_import_kit__fails_when_elementor_uploads_has_no_writing_permissions() {
		// Expect
		$this->expectException( \Error::class );
		$this->expectExceptionMessage( Module::NO_WRITE_PERMISSIONS_KEY . 'in - ' . Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );

		// Arrange
		$elementor_uploads_dir = ( new Server() )->get_system_path( Server::KEY_PATH_ELEMENTOR_UPLOADS_DIR );

		chmod( $elementor_uploads_dir, 0000 );

		clearstatcache();

		// Act
		( new Module() )->import_kit( '', [] );
	}

	/**
	 * @dataProvider get_methods_data_provider
	 */
	public function test_should_show_revert_section( $has_pro, $import_session, $should_show ) {
		// Arrange
		$mock_module = $this->getMockBuilder( Module::class )
			->setMethods( [ 'has_pro' ] )
			->getMock();

		$mock_module->expects( $this->once() )
			->method( 'has_pro' )
			->willReturn( $has_pro );

		// Act
		$should_show_revert_section = $mock_module->should_show_revert_section( $import_session );

		// Assert
		$this->assertEquals( $should_show, $should_show_revert_section );
	}

	public function test_should_show_revert_section__revert_feature_was_not_exits_on_import() {
		// Arrange
		$import_export_module = new Module();

		// Act
		$should_show_revert_section = $import_export_module->should_show_revert_section( [] );

		// Assert
		$this->assertFalse( $should_show_revert_section );
	}

	public function get_methods_data_provider() {
		return [
			'Import done without Pro active' => [
				'has_pro' => false,
				'import_session' => [
					'runners' => []
				],
				'should_show' => true,
			],
			'Import done with Pro active but without templates' => [
				'has_pro' => true,
				'import_session' => [
					'runners' => [
						'tests' => [],
					],
				],
				'should_show' => true,
			],
			'Import done with Pro active and templates were imported by the Pro runner' => [
				'has_pro' => true,
				'import_session' => [
					'runners' => [
						'templates' => [
							'not_empty' => [],
						],
					]
				],
				'should_show' => true,
			],
			'Import done with Pro active and templates were imported by the Core runner (runner not exits in the Pro) but now the Pro deactivate' => [
				'has_pro' => false,
				'import_session' => [
					'runners' => [
						'templates' => [],
					],
				],
				'should_show' => true,
			],
			'Import done with Pro active and templates were imported by the Pro runner but now the Pro deactivate' => [
				'has_pro' => false,
				'import_session' => [
					'runners' => [
						'templates' => [
							'not_empty' => [],
						],
					],
				],
				'should_show' => true,
			],
			'Import done with Pro active and templates were imported by the Core runner' => [
				'has_pro' => true,
				'import_session' => [
					'runners' => [
						'templates' => [],
					]
				],
				'should_show' => false,
			],
		];
	}
}
