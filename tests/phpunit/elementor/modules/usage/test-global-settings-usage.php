<?php
namespace Elementor\Tests\Phpunit\Elementor\Modules\Usage;

use Elementor\Modules\Usage\Global_Settings_Page_Usage;
use ElementorEditorTesting\Elementor_Test_Base;

class Test_Global_Settings_Usage extends Elementor_Test_Base {

	public function test_save_global() {
		// Arrange.
		$document = $this->factory()->create_post();
		$document->save( [
			'settings' => [
				'background_background' => 'red',
			],
		] );

		$global_settings_page_usage = new Global_Settings_Page_Usage();
		$global_settings_page_usage->add( $document );

		// Act.
		$global_settings_page_usage->save_global();
		$collection_from_global = $global_settings_page_usage->create_from_global()->get_collection();

		// Assert.
		$this->assertEqualSets( [
			'wp-post' => [
				'background_background' => 2,
			],
		], $collection_from_global->all() );
	}
}
