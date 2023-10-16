<?php
namespace Elementor\Tests\Phpunit\Elementor\Core\Admin;

use Elementor\Core\Admin\Admin_Notices;
use Elementor\Core\Admin\Notices\Base_Notice;
use Elementor\User;
use ElementorEditorTesting\Elementor_Test_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Test_Admin_Notices extends Elementor_Test_Base {

	public function setUp() {
		parent::setUp();

		remove_all_actions('admin_notices');
	}

	public function test_admin_notices() {
		// Arrange
		$notice = $this->getMockBuilder( Base_Notice::class )
			->setMethods( [ 'should_print', 'get_config' ] )
			->getMock();

		$notice->method( 'should_print' )->willReturn( true );
		$notice->method( 'get_config' )->willReturn( [
			'id'          => 'test_id',
			'title'       => 'test title',
			'description' => 'test description',
		] );

		add_filter( 'elementor/core/admin/notices', function () use ( $notice ) {
			return [ $notice ];
		} );

		new Admin_Notices();

		// Act
		ob_start();

		do_action( 'admin_notices' );

		$result = ob_get_clean();

		// Assert
		$this->assertRegExp( '/\<h3\>test title\<\/h3\>/', $result );
		$this->assertRegExp( '/\<p\>test description\<\/p\>/', $result );
		$this->assertRegExp( '/data-notice_id="test_id"/', $result );
	}

	public function test_admin_notices__should_not_print_if_should_print_returns_false() {
		// Arrange
		$notice = $this->getMockBuilder( Base_Notice::class )
			->setMethods( [ 'should_print', 'get_config' ] )
			->getMock();

		$notice->method( 'should_print' )->willReturn( false );

		$notice->method( 'get_config' )->willReturn( [ 'id' => 'test_id' ] );

		add_filter( 'elementor/core/admin/notices', function () use ( $notice ) {
			return [ $notice ];
		} );

		new Admin_Notices();

		// Act
		ob_start();

		do_action( 'admin_notices' );

		$result = ob_get_clean();

		// Assert
		$this->assertEmpty( $result );
	}

	public function test_design_notice_not_appearing_on_first_install_for_admin() {
		// Arrange
		$this->act_as_admin();

		$admin_notices_mock = $this->getMockBuilder(Admin_Notices::class)
			->setMethods(['elementor_version'])
			->getMock();

		//Act
		update_option( 'elementor_install_history', [ '1.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('1.0.0');

		// Act
		ob_start();
		do_action( 'admin_notices' );
		$result = ob_get_clean();

		// Assert
		$this->assertEmpty( $result );
	}

	public function test_notice_not_appearing_on_second_install_for_author() {
		// Arrange
		$admin_notices_mock = $this->getMockBuilder(Admin_Notices::class)
			->setMethods(['elementor_version'])
			->getMock();

		//Act
		update_option( 'elementor_install_history', [ '1.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('1.0.0');

		ob_start();
		do_action( 'admin_notices' );
		ob_get_clean();

		update_option( 'elementor_install_history', [ '1.0.0' => time(), '2.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('2.0.0');

		ob_start();
		do_action( 'admin_notices' );
		$result = ob_get_clean();

		//Assert
		$this->assertEmpty( $result );
	}

	public function test_notice_appearing_on_second_install_for_admin() {
		// Arrange
		$this->act_as_admin();

		$admin_notices_mock = $this->getMockBuilder(Admin_Notices::class)
			->setMethods(['elementor_version'])
			->getMock();

		//Act
		update_option( 'elementor_install_history', [ '1.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('1.0.0');

		ob_start();
		do_action( 'admin_notices' );
		ob_get_clean();

		update_option( 'elementor_install_history', [ '1.0.0' => time(), '2.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('2.0.0');

		ob_start();
		do_action( 'admin_notices' );
		$result = ob_get_clean();

		//Assert
		$this->assertContains( 'Design not appearing as expected?', $result );
	}

	public function test_notice_not_appearing_on_second_install_for_admin_if_viewed() {
		// Arrange
		$this->act_as_admin();

		$admin_notices_mock = $this->getMockBuilder(Admin_Notices::class)
			->setMethods(['elementor_version'])
			->getMock();

		//Act
		update_option( 'elementor_install_history', [ '1.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('1.0.0');

		ob_start();
		do_action( 'admin_notices' );
		ob_get_clean();

		update_option( 'elementor_install_history', [ '1.0.0' => time(), '2.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('2.0.0');

		ob_start();
		do_action( 'admin_notices' );
		ob_get_clean();

		$notice_id = 'design_not_appearing';
		User::set_notice_viewed( $notice_id, false );

		ob_start();
		do_action( 'admin_notices' );
		$result = ob_get_clean();

		//Assert
		$this->assertEmpty( $result );
	}

	public function test_notice_design_notice_appearing_on_third_install_for_admin_even_if_already_viewed() {
		// Arrange
		$this->act_as_admin();

		$admin_notices_mock = $this->getMockBuilder(Admin_Notices::class)
			->setMethods(['elementor_version'])
			->getMock();

		//Act
		update_option( 'elementor_install_history', [ '1.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('1.0.0');

		ob_start();
		do_action( 'admin_notices' );
		ob_get_clean();

		update_option( 'elementor_install_history', [ '1.0.0' => time(), '2.0.0' => time() ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('2.0.0');

		ob_start();
		do_action( 'admin_notices' );
		ob_get_clean();

		$notice_id = 'design_not_appearing';
		User::set_notice_viewed( $notice_id, false );

		update_option( 'elementor_install_history', [ '1.0.0' => time(), '2.0.0' => time() + 1, '3.0.0' => time() + 2 ] );

		$admin_notices_mock->method('elementor_version')
			->willReturn('3.0.0');

		ob_start();
		do_action( 'admin_notices' );
		$result = ob_get_clean();

		//Assert
		$this->assertEmpty( $result );
	}
}
