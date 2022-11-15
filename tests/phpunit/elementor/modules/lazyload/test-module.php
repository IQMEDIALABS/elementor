<?php
namespace Elementor\Testing\Modules\LazyLoad;

use ElementorEditorTesting\Elementor_Test_Base;
use Elementor\Modules\LazyLoad\Module as LazyLoad;

class Elementor_Test_LazyLoad extends Elementor_Test_Base {

	public function test_remove_background_image() {

		//Arrange
		$image_id = $this->factory()->attachment->create_upload_object( dirname( __DIR__, 3 ) . '/resources/mock-image.png' );
		$image_url = wp_get_attachment_url( $image_id );

		//Act
		$reflection = new \ReflectionClass( LazyLoad::class );
		$method = $reflection->getMethod( 'remove_background_image' );
		$method->setAccessible( true );
		$lazyload = new LazyLoad();
		$value = [
			'id' => $image_id,
			'url' => $image_url,
		];
		$css_property = 'background-image';
		$matches = [
			0 => '{{URL}}',
		];
		$control = [
			'background_lazyload' => [
				'active' => true,
			],
		];
		$removed_image = $method->invokeArgs( $lazyload, [ $value, $css_property, $matches, $control ] );

		//Assert
		$this->assertEquals( 'unset', $removed_image['url'] );
		wp_delete_attachment( $image_id, true );
	}
}
