<?php
namespace Elementor\TemplateLibrary\Classes;

class Import_Images {

	private $_replace_image_ids = [];

	private function _get_hash_image( $attachment_url ) {
		return sha1( $attachment_url );
	}

	private function _return_saved_image( $attachment ) {
		global $wpdb;

		if ( isset( $this->_replace_image_ids[ $attachment['id'] ] ) )
			return $this->_replace_image_ids[ $attachment['id'] ];

		$post_id = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT `post_id` FROM %1$s
					WHERE `meta_key` = \'_elementor_source_image_hash\'
						AND `meta_value` = \'%2$s\'
				;',
				$wpdb->postmeta,
				$this->_get_hash_image( $attachment['url'] )
			)
		);

		if ( $post_id ) {
			$new_attachment = [
				'id' => $post_id,
				'url' => wp_get_attachment_url( $post_id ),
			];
			$this->_replace_image_ids[ $attachment['id'] ] = $new_attachment;

			return $new_attachment;
		}

		return false;
	}

	public function import( $attachment ) {
		$saved_image = $this->_return_saved_image( $attachment );
		if ( $saved_image )
			return $saved_image;

		/**
		 * @var $wp_filesystem \WP_Filesystem_Base
		 */
		global $wp_filesystem;

		// Extract the file name and extension from the url
		$filename = basename( $attachment['url'] );

		$file_content = $wp_filesystem->get_contents( $attachment['url'] );

		if ( ! $file_content ) {
			return false;
		}

		$upload = wp_upload_bits(
			$filename,
			null,
			$file_content
		);

		$post = [
			'post_title' => $filename,
			'guid' => $upload['url'],
		];

		$info = wp_check_filetype( $upload['file'] );
		if ( $info ) {
			$post['post_mime_type'] = $info['type'];
		} else {
			// For now just return the origin attachment
			return $attachment;
			//return new \WP_Error( 'attachment_processing_error', __( 'Invalid file type', 'pojo-importer' ) );
		}

		$post_id = wp_insert_attachment( $post, $upload['file'] );
		wp_update_attachment_metadata(
			$post_id,
			wp_generate_attachment_metadata( $post_id, $upload['file'] )
		);
		update_post_meta( $post_id, '_elementor_source_image_hash', $this->_get_hash_image( $attachment['url'] ) );

		$new_attachment = [
			'id' => $post_id,
			'url' => $upload['url'],
		];
		$this->_replace_image_ids[ $attachment['id'] ] = $new_attachment;
		return $new_attachment;
	}

	public function __construct() {
		if ( ! function_exists( 'WP_Filesystem' ) )
			require_once ABSPATH . 'wp-admin/includes/file.php';

		WP_Filesystem();
	}
}
