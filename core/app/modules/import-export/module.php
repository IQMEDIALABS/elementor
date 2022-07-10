<?php
namespace Elementor\Core\App\Modules\ImportExport;

use Elementor\Core\Base\Module as BaseModule;
use Elementor\Core\Common\Modules\Ajax\Module as Ajax;
use Elementor\TemplateLibrary\Source_Local;
use Elementor\Core\Files\Uploads_Manager;
use Elementor\Plugin;
use Elementor\Tools;
use Elementor\Utils as ElementorUtils;
use Elementor\Core\App\Modules\ImportExport\Utils as ImportExportUtils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Import Export Module
 *
 * Responsible for initializing Elementor App functionality
 */
class Module extends BaseModule {
	const FORMAT_VERSION = '2.0';

	const EXPORT_TRIGGER_KEY = 'elementor_export_kit';

	const UPLOAD_TRIGGER_KEY = 'elementor_upload_kit';

	const IMPORT_TRIGGER_KEY = 'elementor_import_kit';

	const KIT_LIBRARY_REFERRER_KEY = 'kit-library';

	const LOCAL_REFERRER_KEY = 'local';

	const PERMISSIONS_ERROR_KEY = 'plugin-installation-permissions-error';


	/**
	 * Assigning the export process to a property, so we can use the process from outside the class.
	 *
	 * @var Export
	 */
	public $export;

	/**
	 * Assigning the import process to a property, so we can use the process from outside the class.
	 *
	 * @var Import
	 */
	public $import;

	/**
	 * Get name.
	 *
	 * @access public
	 *
	 * @return string
	 */
	public function get_name() {
		return 'import-export';
	}

	public function __construct() {
		$this->register_actions();

		if ( ElementorUtils::is_wp_cli() ) {
			\WP_CLI::add_command( 'elementor kit', WP_CLI::class );
		}
	}

	public function get_init_settings() {
		if ( ! Plugin::$instance->app->is_current() ) {
			return [];
		}

		return $this->get_config_data();
	}

	/**
	 * Register the import/export tab in elementor tools.
	 */
	public function register_settings_tab( Tools $tools ) {
		$tools->add_tab( 'import-export-kit', [
			'label' => esc_html__( 'Import / Export Kit', 'elementor' ),
			'sections' => [
				'intro' => [
					'label' => esc_html__( 'Template Kits', 'elementor' ),
					'callback' => function() {
						$this->render_import_export_tab_content();
					},
					'fields' => [],
				],
			],
		] );
	}

	/**
	 * Render the import/export tab content.
	 */
	private function render_import_export_tab_content() {
		$intro_text_link = sprintf( '<a href="https://go.elementor.com/wp-dash-import-export-general/" target="_blank">%s</a>', esc_html__( 'Learn more', 'elementor' ) );

		$intro_text = sprintf(
		/* translators: 1: New line break, 2: Learn More link. */
			__( 'Design sites faster with a template kit that contains some or all components of a complete site, like templates, content & site settings.%1$sYou can import a kit and apply it to your site, or export the elements from this site to be used anywhere else. %2$s', 'elementor' ),
			'<br>',
			$intro_text_link
		);

		$content_data = [
			'export' => [
				'title' => esc_html__( 'Export a Template Kit', 'elementor' ),
				'button' => [
					'url' => Plugin::$instance->app->get_base_url() . '#/export',
					'text' => esc_html__( 'Start Export', 'elementor' ),
				],
				'description' => esc_html__( 'Bundle your whole site - or just some of its elements - to be used for another website.', 'elementor' ),
				'link' => [
					'url' => 'https://go.elementor.com/wp-dash-import-export-export-flow/',
					'text' => esc_html__( 'Learn More', 'elementor' ),
				],
			],
			'import' => [
				'title' => esc_html__( 'Import a Template Kit', 'elementor' ),
				'button' => [
					'url' => Plugin::$instance->app->get_base_url() . '#/import',
					'text' => esc_html__( 'Start Import', 'elementor' ),
				],
				'description' => esc_html__( 'Apply the design and settings of another site to this one.', 'elementor' ),
				'link' => [
					'url' => 'https://go.elementor.com/wp-dash-import-export-import-flow/',
					'text' => esc_html__( 'Learn More', 'elementor' ),
				],
			],
		];

		$home_page_editor_url = $this->get_elementor_editor_home_page_url();
		$editor_page_link = $home_page_editor_url ? $home_page_editor_url : $this->get_recently_edited_elementor_editor_page_url();

		$info_text = esc_html__( 'Even after you import and apply a Template Kit, you can undo it by restoring a previous version of your site.', 'elementor' ) . '<br>';
		$info_text .= sprintf( '<a href="%1$s" target="_blank">%2$s</a>', $editor_page_link . '#e:run:panel/global/open&e:route:panel/history/revisions', esc_html__( 'Open Site Settings > History > Revisions.', 'elementor' ) );
		?>

		<div class="tab-import-export-kit__content">
			<p class="tab-import-export-kit__info"><?php ElementorUtils::print_unescaped_internal_string( $intro_text ); ?></p>

			<div class="tab-import-export-kit__wrapper">
				<?php foreach ( $content_data as $data ) { ?>
					<div class="tab-import-export-kit__container">
						<div class="tab-import-export-kit__box">
							<h2><?php ElementorUtils::print_unescaped_internal_string( $data['title'] ); ?></h2>
							<a href="<?php ElementorUtils::print_unescaped_internal_string( $data['button']['url'] ); ?>" class="elementor-button elementor-button-success">
								<?php ElementorUtils::print_unescaped_internal_string( $data['button']['text'] ); ?>
							</a>
						</div>
						<p><?php ElementorUtils::print_unescaped_internal_string( $data['description'] ); ?></p>
						<a href="<?php ElementorUtils::print_unescaped_internal_string( $data['link']['url'] ); ?>" target="_blank"><?php ElementorUtils::print_unescaped_internal_string( $data['link']['text'] ); ?></a>
					</div>
				<?php } ?>
			</div>

			<p class="tab-import-export-kit__info"><?php ElementorUtils::print_unescaped_internal_string( $info_text ); ?></p>
		</div>
		<?php
	}

	/**
	 * Upload a kit zip file and get the kit data.
	 *
	 * Assigning the Import process to the 'import' property,
	 * so it will be available to use in different places such as: WP_Cli, Pro, etc.
	 *
	 * @param string $file Path to the file.
	 * @param string $referrer Referrer of the file 'local' or 'kit-library'.
	 * @return array
	 * @throws \Exception
	 */
	public function upload_kit( $file, $referrer ) {
		$this->import = new Import( $file, [ 'referrer' => $referrer ] );

		return [
			'session' => $this->import->get_session_id(),
			'manifest' => $this->import->get_manifest(),
			'conflicts' => $this->import->get_settings_selected_override_conditions(),
		];
	}

	/**
	 * Import a kit by session_id.
	 * Upload and import a kit by kit zip file.
	 *
	 * Assigning the Import process to the 'import' property,
	 * so it will be available to use in different places such as: WP_Cli, Pro, etc.
	 *
	 * @param string $path Path to the file or session_id.
	 * @param array $settings Settings the import use to determine which content to import.
	 *      (e.g: include, selected_plugins, selected_cpt, selected_override_conditions, etc.)
	 * @return array
	 * @throws \Exception
	 */
	public function import_kit( $path, $settings ) {
		$this->import = new Import( $path, $settings );
		$this->import->register_default_runners();

		return $this->import->run();
	}

	/**
	 * Export a kit.
	 *
	 * Assigning the Export process to the 'export' property,
	 * so it will be available to use in different places such as: WP_Cli, Pro, etc.
	 *
	 * @param array $settings Settings the export use to determine which content to export.
	 *      (e.g: include, kit_info, selected_plugins, selected_cpt, etc.)
	 * @return array
	 * @throws \Exception
	 */
	public function export_kit( $settings ) {
		$this->export = new Export( $settings );
		$this->export->register_default_runners();

		return $this->export->run();
	}

	/**
	 * Register appropriate actions.
	 */
	private function register_actions() {
		add_action( 'admin_init', function() {
			if ( wp_doing_ajax() &&
				isset( $_POST['action'] ) &&
				isset( $_POST['_nonce'] ) &&
				wp_verify_nonce( $_POST['_nonce'], Ajax::NONCE_KEY ) &&
				current_user_can( 'manage_options' )
			) {
				$this->maybe_handle_ajax();
			}
		} );

		$page_id = Tools::PAGE_ID;

		add_action( "elementor/admin/after_create_settings/{$page_id}", [ $this, 'register_settings_tab' ] );
	}

	/**
	 * Assign each ajax action to a method.
	 */
	private function maybe_handle_ajax() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		switch ( $_POST['action'] ) {
			case static::EXPORT_TRIGGER_KEY:
				$this->handle_export_kit();
				break;

			case static::UPLOAD_TRIGGER_KEY:
				$this->handle_upload_kit();
				break;

			case static::IMPORT_TRIGGER_KEY:
				$this->handle_import_kit();
				break;

			default:
				break;
		}
	}

	/**
	 * Handle upload kit ajax request.
	 */
	private function handle_upload_kit() {
		// PHPCS - Already validated in caller function.
		if ( ! empty( $_POST['e_import_file'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			if (
				! isset( $_POST['e_kit_library_nonce'] ) ||
				! wp_verify_nonce( $_POST['e_kit_library_nonce'], 'kit-library-import' )
			) {
				throw new \Error( esc_html__( 'Invalid kit library nonce', 'elementor' ) );
			}

			$file_url = $_POST['e_import_file'];

			if ( ! filter_var( $file_url, FILTER_VALIDATE_URL ) || 0 !== strpos( $file_url, 'http' ) ) {
				throw new \Error( esc_html__( 'Invalid URL', 'elementor' ) );
			}

			$remote_zip_request = wp_remote_get( $file_url );

			if ( is_wp_error( $remote_zip_request ) ) {
				throw new \Error( $remote_zip_request->get_error_message() );
			}

			if ( 200 !== $remote_zip_request['response']['code'] ) {
				throw new \Error( $remote_zip_request['response']['message'] );
			}

			$file_name = Plugin::$instance->uploads_manager->create_temp_file( $remote_zip_request['body'], 'kit.zip' );
			$referrer = static::KIT_LIBRARY_REFERRER_KEY;
		} else {
			// PHPCS - Already validated in caller function.
			$file_name = $_FILES['e_import_file']['tmp_name']; // phpcs:ignore WordPress.Security.NonceVerification.Missing
			$referrer = static::LOCAL_REFERRER_KEY;
		}

		$uploaded_kit = $this->upload_kit( $file_name, $referrer );
		$session_dir = $uploaded_kit['session'];
		$manifest = $uploaded_kit['manifest'];
		$conflicts = $uploaded_kit['conflicts'];

		if ( ! empty( $file_url ) ) {
			Plugin::$instance->uploads_manager->remove_file_or_dir( dirname( $file_name ) );
		}

		if ( isset( $manifest['plugins'] ) && ! current_user_can( 'install_plugins' ) ) {
			throw new \Error( static::PERMISSIONS_ERROR_KEY );
		}

		$result = [
			'session' => $session_dir,
			'manifest' => $manifest,
		];

		if ( ! empty( $conflicts ) ) {
			$result['conflicts'] = $conflicts;
		}

		// For BC with our PRO plugin.
		$result = apply_filters( 'elementor/import/stage_1/result', $result );

		wp_send_json_success( $result );
	}

	/**
	 * Handle import kit ajax request.
	 */
	private function handle_import_kit() {
		// PHPCS - Already validated in caller function
		$settings = json_decode( stripslashes( $_POST['data'] ), true ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$tmp_folder_id = $settings['session'];

		$import = $this->import_kit( $tmp_folder_id, $settings );

		wp_send_json_success( $import );
	}

	/**
	 * Handle export kit ajax request.
	 */
	private function handle_export_kit() {
		// PHPCS - Already validated in caller function
		$settings = json_decode( stripslashes( $_POST['data'] ), true ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$export = $this->export_kit( $settings );

		$file_name = $export['file_name'];
		$file = ElementorUtils::file_get_contents( $file_name );

		if ( ! $file ) {
			throw new \Error( esc_html__( 'Could not read the exported file', 'elementor' ) );
		}

		Plugin::$instance->uploads_manager->remove_file_or_dir( dirname( $file_name ) );

		$result = [
			'manifest' => $export['manifest'],
			'file' => base64_encode( $file ),
		];

		wp_send_json_success( $result );
	}

	/**
	 * Get config data that will be exposed to the frontend.
	 */
	private function get_config_data() {
		$export_nonce = wp_create_nonce( 'elementor_export' );
		$export_url = add_query_arg( [ '_nonce' => $export_nonce ], Plugin::$instance->app->get_base_url() );

		return [
			'exportURL' => $export_url,
			'summaryTitles' => $this->get_summary_titles(),
			'builtinWpPostTypes' => ImportExportUtils::get_builtin_wp_post_types(),
			'elementorPostTypes' => ImportExportUtils::get_elementor_post_types(),
			'isUnfilteredFilesEnabled' => Uploads_Manager::are_unfiltered_uploads_enabled(),
			'elementorHomePageUrl' => $this->get_elementor_home_page_url(),
			'recentlyEditedElementorPageUrl' => $this->get_recently_edited_elementor_page_url(),
		];
	}

	/**
	 * Get labels of Elementor document types, Elementor Post types, WordPress Post types and Custom Post types.
	 */
	private function get_summary_titles() {
		$summary_titles = [];

		$document_types = Plugin::$instance->documents->get_document_types();

		foreach ( $document_types as $name => $document_type ) {
			$summary_titles['templates'][ $name ] = [
				'single' => $document_type::get_title(),
				'plural' => $document_type::get_plural_title(),
			];
		}

		$elementor_post_types = ImportExportUtils::get_elementor_post_types();
		$wp_builtin_post_types = ImportExportUtils::get_builtin_wp_post_types();
		$post_types = array_merge( $elementor_post_types, $wp_builtin_post_types );

		foreach ( $post_types as $post_type ) {
			$post_type_object = get_post_type_object( $post_type );

			$summary_titles['content'][ $post_type ] = [
				'single' => $post_type_object->labels->singular_name,
				'plural' => $post_type_object->label,
			];
		}

		$custom_post_types = ImportExportUtils::get_registered_cpt_names();
		if ( ! empty( $custom_post_types ) ) {
			foreach ( $custom_post_types as $custom_post_type ) {

				$custom_post_types_object = get_post_type_object( $custom_post_type );
				//cpt data appears in two arrays:
				//1. content object: in order to show the export summary when completed in getLabel function
				$summary_titles['content'][ $custom_post_type ] = [
					'single' => $custom_post_types_object->labels->singular_name,
					'plural' => $custom_post_types_object->label,
				];

				//2. customPostTypes object: in order to actually export the data
				$summary_titles['content']['customPostTypes'][ $custom_post_type ] = [
					'single' => $custom_post_types_object->labels->singular_name,
					'plural' => $custom_post_types_object->label,
				];
			}
		}

		$active_kit = Plugin::$instance->kits_manager->get_active_kit();

		foreach ( $active_kit->get_tabs() as $key => $tab ) {
			$summary_titles['site-settings'][ $key ] = $tab->get_title();
		}

		return $summary_titles;
	}

	private function get_elementor_editor_home_page_url() {
		if ( 'page' !== get_option( 'show_on_front' ) ) {
			return '';
		}

		$frontpage_id = get_option( 'page_on_front' );

		return $this->get_elementor_editor_page_url( $frontpage_id );
	}

	private function get_elementor_home_page_url() {
		if ( 'page' !== get_option( 'show_on_front' ) ) {
			return '';
		}

		$frontpage_id = get_option( 'page_on_front' );

		return $this->get_elementor_page_url( $frontpage_id );
	}

	private function get_recently_edited_elementor_page_url() {
		$query = ElementorUtils::get_recently_edited_posts_query( [ 'posts_per_page' => 1 ] );

		if ( ! isset( $query->post ) ) {
			return '';
		}

		return $this->get_elementor_page_url( $query->post->ID );
	}

	private function get_recently_edited_elementor_editor_page_url() {
		$query = ElementorUtils::get_recently_edited_posts_query( [ 'posts_per_page' => 1 ] );

		if ( ! isset( $query->post ) ) {
			return '';
		}

		return $this->get_elementor_editor_page_url( $query->post->ID );
	}

	private function get_elementor_document( $page_id ) {
		$document = Plugin::$instance->documents->get( $page_id );

		if ( ! $document || ! $document->is_built_with_elementor() ) {
			return false;
		}

		return $document;
	}

	private function get_elementor_page_url( $page_id ) {
		$document = $this->get_elementor_document( $page_id );

		return $document ? $document->get_preview_url() : '';
	}

	private function get_elementor_editor_page_url( $page_id ) {
		$document = $this->get_elementor_document( $page_id );

		return $document ? $document->get_edit_url() : '';
	}
}
