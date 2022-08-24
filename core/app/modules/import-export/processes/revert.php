<?php
namespace Elementor\Core\App\Modules\ImportExport\Processes;

use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Elementor_Content;
use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Revert_Runner_Base;
use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Plugins;
use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Site_Settings;
use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Taxonomies;
use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Templates;
use Elementor\Core\App\Modules\ImportExport\Runners\Revert\Wp_Content;
use Elementor\Core\App\Modules\ImportExport\Module;
use Elementor\Core\App\Modules\ImportExport\Runners\Runner_Interface;

class Revert {

	/**
	 * @var Revert_Runner_Base[]
	 */
	protected $runners = [];

	private $import_sessions;

	private $revert_sessions;

	/**
	 * @throws \Exception
	 */
	public function __construct() {
		$this->import_sessions = $this->get_import_sessions();
		$this->revert_sessions = $this->get_revert_sessions();
	}

	/**
	 * Register a runner.
	 *
	 * @param Revert_Runner_Base $runner_instance
	 */
	public function register( Revert_Runner_Base $runner_instance ) {
		$this->runners[ $runner_instance::get_name() ] = $runner_instance;
	}

	public function register_default_runners() {
		$this->register( new Site_Settings() );
		$this->register( new Plugins() );
		$this->register( new Templates() );
		$this->register( new Taxonomies() );
		$this->register( new Elementor_Content() );
		$this->register( new Wp_Content() );
	}

	public function run() {
		if ( empty( $this->runners ) ) {
			throw new \Exception( 'Please specify revert runners.' );
		}

		$data = $this->get_last_import_session();

		if ( empty( $data ) ) {
			throw new \Exception( 'Could not find any import sessions to revert.' );
		}

		foreach ( $this->runners as $runner ) {
			if ( $runner->should_revert( $data ) ) {
				$runner->revert( $data );
			}
		}

		$this->revert_attachments( $data );

		$this->delete_last_import_data();
	}

	public function get_import_sessions() {
		$import_sessions = get_option( Module::OPTION_KEY_ELEMENTOR_IMPORT_SESSIONS );

		if ( ! $import_sessions ) {
			return [];
		}

		ksort( $import_sessions, SORT_NUMERIC );

		return $import_sessions;
	}

	public function get_revert_sessions() {
		$revert_sessions = get_option( Module::OPTION_KEY_ELEMENTOR_REVERT_SESSIONS );

		if ( ! $revert_sessions ) {
			return [];
		}

		return $revert_sessions;
	}

	public function get_last_import_session() {
		$import_sessions = $this->import_sessions;

		if ( empty( $import_sessions ) ) {
			return [];
		}

		return end( $import_sessions );
	}

	public function get_penultimate_import_session() {
		$sessions_data = $this->import_sessions;
		$penultimate_element_value = [];

		if ( empty( $sessions_data ) ) {
			return [];
		}

		end( $sessions_data );

		prev( $sessions_data );

		if ( ! is_null( key( $sessions_data ) ) ) {
			$penultimate_element_value = current( $sessions_data );
		}

		return $penultimate_element_value;
	}

	private function delete_last_import_data() {
		$import_sessions = $this->import_sessions;
		$revert_sessions = $this->revert_sessions;

		$reverted_session = array_pop( $import_sessions );

		$revert_sessions[] = [
			'session_id' => $reverted_session['session_id'],
			//          'kit_id' => $reverted_session['kit_id'],
			'kit_name' => $reverted_session['kit_name'],
			'source' => $reverted_session['kit_source'],
			'user_id' => get_current_user_id(),
			'import_timestamp' => $reverted_session['start_timestamp'],
			'revert_timestamp' => current_time( 'timestamp' ),
		];

		update_option( Module::OPTION_KEY_ELEMENTOR_IMPORT_SESSIONS, $import_sessions, 'no' );
		update_option( Module::OPTION_KEY_ELEMENTOR_REVERT_SESSIONS, $revert_sessions, 'no' );

		$this->import_sessions = $import_sessions;
		$this->revert_sessions = $revert_sessions;
	}

	private function revert_attachments( $data ) {
		$query_args = [
			'post_type' => 'attachment',
			'post_status' => 'any',
			'posts_per_page' => -1,
			'meta_query' => [
				[
					'key' => '_elementor_import_session_id',
					'value' => $data['session_id'],
				],
			],
		];

		$query = new \WP_Query( $query_args );

		foreach ( $query->posts as $post ) {
			wp_delete_attachment( $post->ID, true );
		}
	}
}
