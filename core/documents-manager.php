<?php
namespace Elementor\Core;

use Elementor\Core\Base\Document;
use Elementor\Core\DocumentTypes\Post;
use Elementor\Core\Utils\Exceptions;
use Elementor\DB;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Documents_Manager {

	protected $types = [];

	/**
	 * @var Document[]
	 */
	protected $documents = [];

	protected $current_doc_id;

	public function __construct() {
		$this->register_default_types();

		add_action( 'elementor/ajax/register_actions', [ $this, 'register_ajax_actions' ] );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param Ajax_Manager $ajax_manager
	 */
	public function register_ajax_actions( $ajax_manager ) {
		$ajax_manager->register_ajax_action( 'save_builder', [ $this, 'ajax_save' ] );
		$ajax_manager->register_ajax_action( 'discard_changes', [ $this, 'ajax_discard_changes' ] );
	}

	public function register_default_types() {
		$default_types = [
			'post' => Post::get_class_full_name(),
		];

		foreach ( $default_types as $type => $class ) {
			$this->register_document_type( $type, $class );
		}

		do_action( 'elementor/documents/register', $this );
	}

	public function register_document_type( $type, $class ) {
		$this->types[ $type ] = $class;
		return $this;
	}

	/**
	 * @param int  $post_id
	 * @param bool $from_cache
	 *
	 * @return Document
	 */
	public function get( $post_id, $from_cache = true ) {
		if ( $from_cache || ! isset( $this->documents[ $post_id ] ) ) {
			$doc_type = get_post_meta( $post_id, Document::TYPE_META_KEY, true );

			$doc_type_class = $this->get_document_type( $doc_type );
			$this->documents[ $post_id ] = new $doc_type_class( [
				'post_id' => $post_id,
			] );
		}

		return $this->documents[ $post_id ];
	}

	public function get_doc_or_auto_save( $id, $user_id = 0 ) {
		$document = $this->get( $id );
		if ( $document->get_autosave_id( $user_id ) ) {
			$document = $document->get_autosave( $user_id );
		}

		return $document;
	}

	public function get_doc_for_frontend( $post_id ) {
		if ( is_preview() || Plugin::$instance->preview->is_preview_mode() ) {
			$document = $this->get_doc_or_auto_save( $post_id, get_current_user_id() );
		} else {
			$document = $this->get( $post_id );
		}

		return $document;
	}

	public function get_document_type( $type ) {
		return isset( $this->types[ $type ] ) ? $this->types[ $type ] : $this->types['post'];
	}

	/**
	 * @param string $type
	 * @param array $post_data
	 * @param array $meta_data
	 *
	 * @return Document
	 */
	public function create( $type, $post_data = [], $meta_data = [] ) {
		if ( ! isset( $this->types[ $type ] ) ) {
			/* translators: %s: document type name */
			wp_die( sprintf( __( 'Type %s does not exist.', 'elementor' ), $type ) );
		}

		if ( empty( $post_data['post_title'] ) ) {
			$post_data['post_title'] = __( 'Elementor', '' );
			$update_title = true;
		}

		$post_id = wp_insert_post( $post_data );

		if ( ! empty( $update_title ) ) {
			$post_data['ID'] = $post_id;
			$post_data['post_title'] .= ' #' . $post_id;
			wp_update_post( $post_data );
		}

		add_post_meta( $post_id, '_elementor_edit_mode', 'builder' );

		foreach ( $meta_data as $key => $value ) {
			add_post_meta( $post_id, $key, $value );
		}

		/** @var Document $document */

		$class_name = $this->types[ $type ];

		$document = new $class_name( [
			'post_id' => $post_id,
		] );

		$document->save_type();

		return $document;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param $request
	 *
	 * @return array|mixed|void
	 * @throws \Exception If current user don't have permissions to edit the post or the post is not using Elementor.
	 */
	public function	ajax_save( $request ) {
		if ( empty( $request['post_id'] ) ) {
			throw new \Exception( 'Missing post id.' );
		}

		$document = $this->get( $request['post_id'] );

		if ( ! $document->is_built_with_elementor() || ! $document->is_editable_by_current_user() ) {
			throw new \Exception( 'Access denied.' );
		}

		$status = DB::STATUS_DRAFT;

		if ( isset( $request['status'] ) && in_array( $request['status'], [ DB::STATUS_PUBLISH, DB::STATUS_PRIVATE, DB::STATUS_PENDING, DB::STATUS_AUTOSAVE ] , true ) ) {
			$status = $request['status'];
		}

		if ( DB::STATUS_AUTOSAVE === $status ) {
			// If the post is a draft - save the `autosave` to the original draft.
			// Allow a revision only if the original post is already published.
			if ( in_array( $document->get_post()->post_status, [ DB::STATUS_PUBLISH, DB::STATUS_PRIVATE ], true ) ) {
				$document = $document->get_autosave( 0, true );
			}
		}

		$data = [
			'elements' => $request['elements'],
			'settings' => $request['settings'],
		];

		$document->save( $data );

		// Refresh after save.
		$document = $this->get( $document->get_post()->ID, false );

		$return_data = [
			'config' => [
				'last_edited' => $document->get_last_edited(),
				'wp_preview' => [
					'url' => $document->get_wp_preview_url(),
				],
			],
		];

		/**
		 * Returned documents ajax saved data.
		 *
		 * Filters the ajax data returned when saving the post on the builder.
		 *
		 * @since 2.0.0
		 *
		 * @param array $return_data The returned data. Default is an empty array.
		 */
		$return_data = apply_filters( 'elementor/documents/ajax_save/return_data', $return_data, $document );

		return $return_data;
	}

	public function ajax_discard_changes( $request ) {
		if ( empty( $request['post_id'] ) ) {
			throw new \Exception( 'Missing post id.', Exceptions::BAD_REQUEST );
		}

		$document = $this->get( $request['post_id'] );

		$autosave = $document->get_autosave();

		if ( $autosave ) {
			$success = $autosave->delete();
		} else {
			$success = true;
		}

		return $success;
	}

	public function set_current( $post_id ) {
		$this->current_doc_id = $post_id;
	}

	public function get_current() {
		return $this->get( $this->current_doc_id );
	}
}
