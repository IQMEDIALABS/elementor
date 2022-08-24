<?php

namespace Elementor\Core\App\Modules\ImportExport\Runners\Import;

use Elementor\Core\App\Modules\ImportExport\Runners\Runner_Interface;

abstract class Import_Runner_Base implements Runner_Interface {

	const IMPORT_SESSION_META_KEY = '_elementor_import_session_id';

	/**
	 * By the passed data we should decide if we want to run the import function of the runner or not.
	 *
	 * @param array $data
	 *
	 * @return bool
	 */
	abstract public function should_import( array $data );

	/**
	 * Main function of the runner import process.
	 *
	 * @param array $data Necessary data for the import process.
	 * @param array $imported_data Data that already imported by previously runners.
	 *
	 * @return array The result of the import process
	 */
	abstract public function import( array $data, array $imported_data );

	public function get_import_session_metadata() : array {
		return [];
	}

	public function set_session_post_meta( $post_id, $meta_value ) {
		update_post_meta( $post_id, static::IMPORT_SESSION_META_KEY, $meta_value );
	}

	public function set_session_term_meta( $term_id, $meta_value ) {
		update_term_meta( $term_id, static::IMPORT_SESSION_META_KEY, $meta_value );
	}
}
