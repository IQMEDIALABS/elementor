<?php
namespace Elementor\Tests\Phpunit\Elementor\Data\Base;

use Elementor\Data\Base\Endpoint\Index;
use Elementor\Tests\Phpunit\Elementor\Data\Base\Mock\Template\SubEndpoint;
use Elementor\Tests\Phpunit\Elementor\Data\Base\Mock\WithEndpoint\Controller as ControllerWithEndpoint;
use Elementor\Tests\Phpunit\Elementor\Data\Base\Mock\Template\Controller as ControllerTemplate;
use Elementor\Tests\Phpunit\Elementor\Data\Base\Mock\Template\Endpoint as EndpointTemplate;
use Exception;

class Test_Endpoint extends Data_Test_Base {
	public function test_create_simple() {
		$test_controller_instance = new ControllerWithEndpoint();
		$this->manager->run_server();

		// Validate `$this->>register()`.
		$this->assertCount( 1, $test_controller_instance->endpoints );
	}

	public function test_get_base_route() {
		$controller_instance = new ControllerWithEndpoint();
		$this->manager->run_server();

		$endpoint_instance = array_values( $controller_instance->endpoints )[ 0 ];

		$this->assertEquals(
			'/' . $controller_instance->get_name() . '/' . $endpoint_instance->get_name(),
			$endpoint_instance->get_base_route()
		);
	}

	public function test_get_public_name() {
		$controller_instance = new ControllerWithEndpoint();

		$this->manager->run_server();

		$endpoint_instance = array_values( $controller_instance->endpoints )[ 0 ];
		$endpoint_index_instance = $controller_instance->get_endpoint_index();

		$this->assertEquals( '', $endpoint_index_instance->get_public_name() );
		$this->assertEquals( $endpoint_instance->get_name(), $endpoint_instance->get_public_name() );
	}

	public function test_get_full_command() {
		$controller_instance = new ControllerWithEndpoint();

		$this->manager->run_server();

		$endpoint_instance = array_values( $controller_instance->endpoints )[ 0 ];

		$this->assertEquals( $controller_instance->get_name() . '/' . $endpoint_instance->get_name(), $endpoint_instance->get_full_command() );
	}

	public function test_get_base_route_index_endpoint() {
		$this->manager->run_server();
		$controller_instance = new ControllerTemplate();

		$endpoint_instance = $controller_instance->do_register_endpoint( new Index( $controller_instance ) );

		$this->assertEquals( '/' . $controller_instance->get_name() , $endpoint_instance->get_base_route() );
	}

	public function test_register() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'get_items', 'valid' );

		// Validate register did 'register_items_route'.
		$data = $this->manager->run_endpoint( $controller_instance->get_name() . '/' . $endpoint_instance->get_name() );

		$this->assertEquals( $data, 'valid' );
	}

	public function test_register_sub_endpoint() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$sub_endpoint_instance = $endpoint_instance->do_register_sub_endpoint(
			new SubEndpoint( $endpoint_instance, 'test-route' )
		);
		$sub_endpoint_instance->set_test_data( 'get_items', 'valid' );

		$endpoint = $controller_instance->get_name()  . '/' .
			$endpoint_instance->get_name() .
            '/test-route/' .
            $sub_endpoint_instance->get_name();

		$data = $this->manager->run_endpoint( $endpoint  );

		$this->assertEquals( $data, 'valid' );
	}

	public function test_register_sub_endpoint_run_as_command() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$this->manager->register_controller_instance( $controller_instance );

		$sub_endpoint_instance = $endpoint_instance->do_register_sub_endpoint(
			new SubEndpoint( $endpoint_instance, 'test-route' )
		);
		$sub_endpoint_instance->set_test_data( 'get_items', 'valid' );

		$data = $this->manager->run( $sub_endpoint_instance->get_full_command() );

		$this->assertEquals( $data, 'valid' );
	}

	public function test_register_sub_endpoint_with_sub_endpoint_parent() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$this->manager->register_controller_instance( $controller_instance );

		$sub_endpoint_instance = $endpoint_instance->do_register_sub_endpoint(
			new SubEndpoint( $endpoint_instance, '/first-sub-route' )
		);

		$descendant_endpoint_instance = $sub_endpoint_instance->register_sub_endpoint(
			new SubEndpoint( $sub_endpoint_instance, '/second-sub-route' )
		);
		$descendant_endpoint_instance->set_test_data( 'get_items', 'valid' );

		$endpoint = $controller_instance->get_name() . '/' .
		            $endpoint_instance->get_name() . '/' .
		            'first-sub-route/' .
		            $sub_endpoint_instance->get_name() . '/' .
		            'second-sub-route/' .
		            $descendant_endpoint_instance->get_name();

		$data = $this->manager->run_endpoint( $endpoint  );

		$this->assertEquals( $data, 'valid' );
	}

	public function test_register_sub_endpoint_with_sub_endpoint_parent_run_as_command() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$this->manager->register_controller_instance( $controller_instance );

		$sub_endpoint_instance = $endpoint_instance->do_register_sub_endpoint(
			new SubEndpoint( $endpoint_instance, 'first-sub-route' )
		);

		$descendant_endpoint_instance = $sub_endpoint_instance->register_sub_endpoint(
			new SubEndpoint( $sub_endpoint_instance, 'first-sub-route/second-sub-route' )
		);
		$descendant_endpoint_instance->set_test_data( 'get_items', 'valid' );

		$data = $this->manager->run( $descendant_endpoint_instance->get_full_command()  );

		$this->assertEquals( $data, 'valid' );
	}

	public function test_base_callback() {
		$excepted_data = [ 'test' => true ];
		$controller = new ControllerTemplate();
		$controller->bypass_original_register();

		$endpoint_instance = $controller->do_register_endpoint( new EndpointTemplate( $controller ) );

		$endpoint_instance->set_test_data( 'get_items', $excepted_data );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::READABLE, new \WP_REST_Request(), true );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'get_item', $excepted_data );
		$request = new \WP_REST_Request( 'GET', [ 'id' => true ] );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::READABLE, $request, false );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'create_items', $excepted_data );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::CREATABLE, new \WP_REST_Request(), true );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'create_item', $excepted_data );
		$request = new \WP_REST_Request( 'CREATE', [ 'id' => true ] );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::CREATABLE, $request, false );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'update_items', $excepted_data );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::EDITABLE, new \WP_REST_Request(), true );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'update_item', $excepted_data );
		$request = new \WP_REST_Request( 'PUT', [ 'id' => true ] );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::EDITABLE, $request, false );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'delete_items', $excepted_data );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::DELETABLE, new \WP_REST_Request(), true );
		$this->assertEquals( $excepted_data, $result->get_data() );

		$endpoint_instance->set_test_data( 'delete_item', $excepted_data );
		$request = new \WP_REST_Request( 'DELETE', [ 'id' => true ] );
		$result = $endpoint_instance->base_callback( \WP_REST_Server::DELETABLE, $request, false );
		$this->assertEquals( $excepted_data, $result->get_data() );
	}

	public function test_base_callback_invalid_method() {
		$controller = new ControllerTemplate();
		$controller->bypass_original_register();

		$endpoint_instance = $controller->do_register_endpoint( new EndpointTemplate( $controller ) );

		$this->expectException( Exception::class );
		$endpoint_instance->base_callback( 'some-invalid-method', new \WP_REST_Request(), true );
	}

	public function test_get_item() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'get_item', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->get_item( null,null ) );
	}

	public function test_get_item_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_item_route();

		$endpoint_instance->set_test_data( 'get_item', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' ) . '/fake_id';

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint ) );
	}

	public function test_get_items() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'get_items', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->get_items( null ) );
	}

	public function test_get_items_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );

		$endpoint_instance->set_test_data( 'get_items', 'valid' );

		$this->assertEquals( 'valid', $this->manager->run_endpoint( trim( $endpoint_instance->get_base_route(), '/' ) ) );
	}

	public function test_create_item() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'create_item', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->create_item( null,null ) );
	}

	public function test_create_item_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_item_route( \WP_REST_Server::CREATABLE );

		$endpoint_instance->set_test_data( 'create_item', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' ) . '/fake_id';

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint, [], \WP_REST_Server::CREATABLE ) );
	}

	public function test_create_items() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'create_items', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->create_items( null ) );
	}

	public function test_create_items_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_items_route( \WP_REST_Server::CREATABLE );

		$endpoint_instance->set_test_data( 'create_items', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' );

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint, [], 'POST' ) );
	}

	public function test_update_item() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'update_item', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->update_item( null,null ) );
	}

	public function test_update_item_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_item_route( \WP_REST_Server::EDITABLE );

		$endpoint_instance->set_test_data( 'update_item', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' ) . '/fake_id';

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint, [], 'PUT' ) );
	}

	public function test_update_items() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'update_items', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->update_items( null ) );
	}

	public function test_update_items_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_items_route( \WP_REST_Server::EDITABLE );

		$endpoint_instance->set_test_data( 'update_items', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' );

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint, [], 'PUT' ) );
	}

	public function test_delete_item() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'delete_item', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->delete_item( null,null ) );
	}

	public function test_delete_item_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_item_route( \WP_REST_Server::DELETABLE );

		$endpoint_instance->set_test_data( 'delete_item', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' ) . '/fake_id';

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint, [], 'DELETE' ) );
	}

	public function test_delete_items() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = new EndpointTemplate( $controller_instance );

		$endpoint_instance->set_test_data( 'delete_items', 'valid' );

		$this->assertEquals( 'valid', $endpoint_instance->delete_items( null ) );
	}

	public function test_delete_items_simulated() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$endpoint_instance = $controller_instance->do_register_endpoint( new EndpointTemplate( $controller_instance ) );
		$endpoint_instance->register_items_route( \WP_REST_Server::DELETABLE );

		$endpoint_instance->set_test_data( 'delete_items', 'valid' );
		$endpoint = trim( $endpoint_instance->get_base_route(), '/' );

		$this->assertEquals( 'valid', $this->manager->run_endpoint( $endpoint, [], 'DELETE' ) );
	}

	public function test_register_item_route() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$controller_instance->bypass_original_register();

		$endpoint_instance = new EndpointTemplate( $controller_instance );
		$endpoint_instance->register_item_route();

		$except_route = '/' . $controller_instance->get_controller_route() . '/' . $endpoint_instance->get_name() . '/(?P<id>[\w]+)';

		$data = $controller_instance->get_controller_index()->get_data();

		$this->assertArrayHaveKeys( [ $except_route ], $data['routes'] );
	}

	public function test_register_items_route() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$controller_instance->bypass_original_register();

		$endpoint_instance = new EndpointTemplate( $controller_instance );
		$endpoint_instance->register_items_route();

		$data = $controller_instance->get_controller_index()->get_data();
		$except_route = '/' . $controller_instance->get_controller_route() . '/' . $endpoint_instance->get_name();

		$this->assertArrayHaveKeys( [ $except_route ], $data['routes'] );
	}

	public function test_register_route() {
		$this->manager->run_server();

		$controller_instance = new ControllerTemplate();
		$controller_instance->bypass_original_register();

		$endpoint_instance = new EndpointTemplate( $controller_instance );
		$endpoint_instance->register_route( '/custom-route' );

		$data = $controller_instance->get_controller_index()->get_data();
		$except_route = '/' . $controller_instance->get_controller_route() . '/' . $endpoint_instance->get_name() . '/custom-route';

		$this->assertArrayHaveKeys( [ $except_route ], $data['routes'] );
	}
}
