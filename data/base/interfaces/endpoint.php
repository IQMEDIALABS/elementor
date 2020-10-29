<?php

namespace Elementor\Data\Base\Interfaces;

use Elementor\Data\Base\SubEndpoint;
use WP_REST_Server;

interface Endpoint {
	/**
	 * Get endpoint name.
	 *
	 * @return string
	 */
	public function get_name();

	/**
	 * Get endpoint format.
	 *
	 * @note The formats that generated using this function, will be used only be `Data\Manager::run()`.
	 *
	 * @return string
	 */
	public function get_format();

	/**
	 * Get controller.
	 *
	 * @return \Elementor\Data\Base\Controller
	 */
	public function get_controller();

	/**
	 * Get base route.
	 *
	 * @note This method should always return the base route starts with '/' and ends without '/'.
	 *
	 * @return string
	 */
	public function get_base_route();

	/**
	 * Get public name.
	 *
	 * @return string
	 */
	public function get_public_name();

	/**
	 * Get full command name ( including index ).
	 *
	 * @return string
	 */
	public function get_full_command();

	/**
	 * Base callback.
	 *
	 * @note All reset requests from the client should pass this function.
	 *
	 * @param string $methods
	 * @param \WP_REST_Request $request
	 * @param bool $is_multi
	 *
	 * @return mixed|\WP_Error|\WP_HTTP_Response|\WP_REST_Response
	 */
	public function base_callback( $methods, $request, $is_multi = false );

	/**
	 * Get permission callback.
	 *
	 * By default get permission callback from the controller.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return boolean
	 */
	public function get_permission_callback( $request );

	/**
	 * Retrieves a collection of items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request );

	/**
	 * Retrieves one item from the collection.
	 *
	 * @param string $id
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $id, $request );

	/**
	 * Creates multiple items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function create_items( $request );

	/**
	 * Creates one item.
	 *
	 * @param string $id id of request item.
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $id, $request );

	/**
	 * Updates multiple items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function update_items( $request );

	/**
	 * Updates one item.
	 *
	 * @param string $id id of request item.
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $id, $request );

	/**
	 * Delete multiple items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function delete_items( $request );

	/**
	 * Delete one item.
	 *
	 * @param string $id id of request item.
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $id, $request );

	/**
	 * Register item route.
	 *
	 * @param string $route
	 * @param array $args
	 * @param string $methods
	 */
	public function register_item_route( $methods = WP_REST_Server::READABLE, $args = [], $route = '/' );

	/**
	 * Register items route.
	 *
	 * @param string $methods
	 */
	public function register_items_route( $methods = WP_REST_Server::READABLE );

	/**
	 * Register route.
	 *
	 * @param string $route
	 * @param string $methods
	 * @param null $callback
	 * @param array $args
	 *
	 * @return bool
	 */
	public function register_route( $route = '', $methods = WP_REST_Server::READABLE, $callback = null, $args = [] );

	/**
	 * Register sub endpoint.
	 *
	 * @param \Elementor\Data\Base\SubEndpoint $endpoint
	 *
	 * @return \Elementor\Data\Base\SubEndpoint\Proxy
	 */
	public function register_sub_endpoint( SubEndpoint $endpoint );
}
