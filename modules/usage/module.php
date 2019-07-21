<?php

namespace Elementor\Modules\Usage;

use Elementor\Core\Base\Document;
use Elementor\Core\Base\Module as BaseModule;
use Elementor\System_Info\Main as System_Info;
use Elementor\DB;
use Elementor\Plugin;
use WP_Post;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor usage module.
 *
 * Elementor usage module handler class is responsible for registering and
 * managing Elementor usage modules.
 *
 */
class Module extends BaseModule {
	const META_KEY = '_elementor_elements_usage';
	const OPTION_NAME = 'elementor_elements_usage';

	/**
	 * @var bool
	 */
	private $is_document_saving = false;

	/**
	 * Get module name.
	 *
	 * Retrieve the usage module name.
	 *
	 * @access public
	 *
	 * @return string Module name.
	 */
	public function get_name() {
		return 'usage';
	}

	/**
	 * Get formatted usage
	 *
	 * Retrieve formatted usage, for frontend.
	 *
	 * @return array
	 */
	public function get_formatted_usage() {
		$usage = [];

		foreach ( get_option( self::OPTION_NAME, [] ) as $doc_type => $elements ) {
			$doc_class = Plugin::$instance->documents->get_document_type( $doc_type );

			if ( $doc_class ) {
				$doc_title = $doc_class::get_title();
			} else {
				$doc_title = $doc_type;
			}

			$tab_group = $doc_class::get_property( 'admin_tab_group' );

			if ( $tab_group ) {
				$doc_title = ucwords( $tab_group ) . ' - ' . $doc_title;
			}

			// Sort by key.
			ksort( $elements );

			foreach ( $elements as $element_type => $data ) {
				unset( $elements[ $element_type ] );

				if ( in_array( $element_type, [ 'section', 'column' ], true ) ) {
					continue;
				}

				$widget_instance = Plugin::$instance->widgets_manager->get_widget_types( $element_type );

				if ( $widget_instance ) {
					$widget_title = $widget_instance->get_title();
				} else {
					$widget_title = $element_type;
				}

				$elements[ $widget_title ] = $data['count'];
			}

			$usage[ $doc_type ] = [
				'title' => $doc_title,
				'elements' => $elements,
			];
		}

		return $usage;
	}

	/***
	 * Set saving flag
	 *
	 * Called on elementor/document/before_save
	 */
	public function set_saving_flag() {
		$this->is_document_saving = true;
	}

	/**
	 * Save the current usage
	 *
	 * Called on elementor/document/after_save
	 *
	 * @param Document $document
	 */
	public function save_usage( $document ) {
		if ( DB::STATUS_PUBLISH === $document->get_post()->post_status ) {
			$this->save_document_usage( $document );
		}

		$this->is_document_saving = false;
	}

	/**
	 * On Status Change
	 *
	 * Called on transition_post_status
	 *
	 * @param string $new_status
	 * @param string $old_status
	 * @param WP_Post $post
	 */
	public function on_status_change( $new_status, $old_status, $post ) {
		$document = Plugin::$instance->documents->get( $post->ID );

		if ( ! $document ) {
			return;
		}

		$is_update = 'publish' === $old_status && 'publish' === $new_status;
		$is_public_unpublish = 'publish' === $old_status && 'publish' !== $new_status;
		$is_private_unpublish = 'private' === $old_status && 'private' !== $new_status;

		if ( $is_update || $is_public_unpublish || $is_private_unpublish ) {
			$prev_usage = $document->get_meta( self::META_KEY );

			$this->remove_from_global( $document->get_name(), $prev_usage );
		}

		// If it's from elementor editor, the usage should be saved after post meta was updated.
		if ( $this->is_document_saving ) {
			return;
		}

		$is_public_publish = 'publish' !== $old_status && 'publish' === $new_status;
		$is_private_publish = 'private' !== $old_status && 'private' === $new_status;

		if ( $is_public_publish || $is_private_publish ) {
			$this->save_document_usage( $document );
		}
	}

	/**
	 * Add's tracking data
	 *
	 * Called on elementor/tracker/send_tracking_data_params
	 *
	 * @param array $params
	 *
	 * @return array
	 */
	public function add_tracking_data( $params ) {
		$params['usages']['elements'] = get_option( self::OPTION_NAME );

		return $params;
	}

	/***
	 * Recalculate usage
	 *
	 * Recalculate usage for all elementor posts
	 *
	 * @param int $limit
	 * @param int $offset
	 */
	public function recalc_usage( $limit = -1, $offset = 0 ) {
		if ( 0 === $offset ) {
			delete_option( self::OPTION_NAME );
		}

		$post_types = get_post_types( array( 'public' => true ) );

		$query = new \WP_Query( [
			'meta_key' => '_elementor_data',
			'post_type' => $post_types,
			'post_status' => 'publish',
			'posts_per_page' => $limit,
			'offset' => $offset,
		] );

		foreach ( $query->posts as $post ) {
			$document = Plugin::$instance->documents->get( $post->ID );

			if ( ! $document ) {
				continue;
			}

			$this->save_usage( $document );
		}
	}

	/**
	 * Increase controls count
	 *
	 * Increase controls count, for each element
	 *
	 * @param array & $element_ref
	 * @param string $tab
	 * @param string $section
	 * @param string $control
	 * @param int $count
	 */
	private function increase_controls_count( & $element_ref, $tab, $section, $control, $count ) {
		if ( ! isset( $element_ref['controls'][ $tab ] ) ) {
			$element_ref['controls'][ $tab ] = [];
		}

		if ( ! isset( $element_ref['controls'][ $tab ][ $section ] ) ) {
			$element_ref['controls'][ $tab ][ $section ] = [];
		}

		if ( ! isset( $element_ref['controls'][ $tab ][ $section ][ $control ] ) ) {
			$element_ref['controls'][ $tab ][ $section ][ $control ] = 0;
		}

		$element_ref['controls'][ $tab ][ $section ][ $control ] += $count;
	}

	/***
	 * Add to global
	 *
	 * Add's usage to global (update database).
	 *
	 * @param string $doc_name
	 * @param array $doc_usage
	 */
	private function add_to_global( $doc_name, $doc_usage ) {
		$global_usage = get_option( self::OPTION_NAME, [] );

		foreach ( $doc_usage as $element_type => $element_data ) {
			if ( ! isset( $global_usage[ $doc_name ] ) ) {
				$global_usage[ $doc_name ] = [];
			}

			if ( ! isset( $global_usage[ $doc_name ][ $element_type ] ) ) {
				$global_usage[ $doc_name ][ $element_type ] = [
					'count' => 0,
					'controls' => [],
				];
			}

			$global_element_ref = &$global_usage[ $doc_name ][ $element_type ];
			$global_element_ref['count'] += $element_data['count'];

			if ( empty( $element_data['controls'] ) ) {
				continue;
			}

			foreach ( $element_data['controls'] as $tab => $sections ) {
				foreach ( $sections as $section => $controls ) {
					foreach ( $controls as $control => $count ) {
						$this->increase_controls_count( $global_element_ref, $tab, $section, $control, $count );
					}
				}
			}
		}

		update_option( self::OPTION_NAME, $global_usage, false );
	}

	/***
	 * Remove from global
	 *
	 * Remove's usage from global (update database).
	 *
	 * @param string $doc_name
	 * @param array $doc_usage
	 */
	private function remove_from_global( $doc_name, $doc_usage ) {
		$global_usage = get_option( self::OPTION_NAME, [] );

		foreach ( $doc_usage as $element_type => $doc_value ) {
			if ( isset( $global_usage[ $doc_name ][ $element_type ]['count'] ) ) {
				$global_usage[ $doc_name ][ $element_type ]['count'] -= $doc_usage[ $element_type ]['count'];

				if ( 0 === $global_usage[ $doc_name ][ $element_type ]['count'] ) {
					unset( $global_usage[ $doc_name ][ $element_type ] );

					continue;
				}

				foreach ( $doc_usage[ $element_type ]['controls'] as $tab => $sections ) {
					foreach ( $sections as $section => $controls ) {
						foreach ( $controls as $control => $count ) {
							if ( isset( $global_usage[ $doc_name ][ $element_type ]['controls'][ $tab ][ $section ][ $control ] ) ) {
								$section_ref = &$global_usage[ $doc_name ][ $element_type ]['controls'][ $tab ][ $section ];

								$section_ref[ $control ] -= $count;

								if ( 0 === $section_ref[ $control ] ) {
									unset( $section_ref[ $control ] );
								}
							}
						}
					}
				}
			}
		}

		update_option( self::OPTION_NAME, $global_usage, false );
	}

	/***
	 * Get elements usage
	 *
	 * Get's the current elements usage by passed elements array parameter.
	 *
	 * @param array $elements
	 *
	 * @return array
	 */
	private function get_elements_usage( $elements ) {
		$usage = [];

		Plugin::$instance->db->iterate_data( $elements, function ( $element ) use ( & $usage ) {
			if ( empty( $element['widgetType'] ) ) {
				$type = $element['elType'];
				$element_instance = Plugin::$instance->elements_manager->get_element_types( $type );
			} else {
				$type = $element['widgetType'];
				$element_instance = Plugin::$instance->widgets_manager->get_widget_types( $type );
			}

			if ( ! isset( $usage[ $type ] ) ) {
				$usage[ $type ] = [
					'count' => 0,
					'control_percent' => 0,
					'controls' => null,
				];
			}

			$usage[ $type ]['count'] ++;

			if ( ! $element_instance ) {
				return $element;
			}

			$controls = $element_instance->get_controls();

			$changed_controls_count = 0;

			// Loop over all element settings
			foreach ( $element['settings'] as $control => $value ) {
				if ( empty( $controls[ $control ] ) ) {
					continue;
				}

				$control_config = $controls[ $control ];

				$tab = $control_config['tab'];

				if ( ! isset( $control_config['section'], $control_config['default'] ) ) {
					continue;
				}

				$section = $control_config['section'];

				// If setting value is not the control default
				if ( $value !== $control_config['default'] ) {
					$this->increase_controls_count( $usage[ $type ], $tab, $section, $control, 1 );

					$changed_controls_count ++;
				}
			}

			$percent = $changed_controls_count / ( count( $controls ) / 100 );
			$usage[ $type ] ['control_percent'] = (int) round( $percent );

			return $element;
		} );

		return $usage;
	}

	/**
	 * Save document usage
	 *
	 * Save requested document usage, and update global.
	 *
	 * @param Document $document
	 */
	private function save_document_usage( Document $document ) {
		if ( ! $document::get_property( 'is_editable' ) ) {
			return;
		}

		// current
		$usage = $this->get_elements_usage( $document->get_elements_raw_data() );

		$document->update_meta( self::META_KEY, $usage );

		$this->add_to_global( $document->get_name(), $usage );
	}

	/**
	 * Usage module constructor.
	 *
	 * Initializing Elementor usage module.
	 *
	 * @access public
	 */
	public function __construct() {
		add_action( 'transition_post_status', [ $this, 'on_status_change' ], 10, 3 );

		add_action( 'elementor/document/before_save', [ $this, 'set_saving_flag' ] );
		add_action( 'elementor/document/after_save', [ $this, 'save_usage' ] );

		add_filter( 'elementor/tracker/send_tracking_data_params', [ $this, 'add_tracking_data' ] );

		System_Info::add_report( 'usage', [
			'file_name' => __DIR__ . '/usage-reporter.php',
			'class_name' => __NAMESPACE__ . '\Usage_Reporter',
		] );
	}
}
