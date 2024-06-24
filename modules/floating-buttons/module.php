<?php

namespace Elementor\Modules\FloatingButtons;

use Elementor\Controls_Manager;
use Elementor\Core\Admin\Menu\Admin_Menu_Manager;
use Elementor\Core\Base\Document;
use Elementor\Core\Base\Module as BaseModule;
use Elementor\Core\Documents_Manager;
use Elementor\Core\Experiments\Manager;
use Elementor\Modules\FloatingButtons\AdminMenuItems\Floating_Buttons_Empty_View_Menu_Item;
use Elementor\Modules\FloatingButtons\AdminMenuItems\Floating_Buttons_Menu_Item;
use Elementor\Modules\FloatingButtons\Base\Widget_Contact_Button_Base;
use Elementor\Modules\FloatingButtons\Control\Hover_Animation_Floating_Buttons;
use Elementor\Modules\FloatingButtons\Documents\Floating_Buttons;
use Elementor\Plugin;
use Elementor\TemplateLibrary\Source_Local;
use Elementor\Utils as ElementorUtils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends BaseModule {

	const EXPERIMENT_NAME = 'floating-buttons';

	const META_CLICK_TRACKING = '_elementor_click_tracking';

	const CLICK_TRACKING_NONCE = 'elementor-conversion-center-click';

	const FLOATING_BUTTONS_DOCUMENT_TYPE = 'floating-buttons';
	const CPT_FLOATING_BUTTONS = 'e-floating-buttons';
	const ADMIN_PAGE_SLUG_CONTACT = 'edit.php?post_type=e-floating-buttons';

	private $has_contact_pages = null;
	private $trashed_contact_pages;
	private $new_contact_pages_url;

	public static function is_active(): bool {
		return Plugin::$instance->experiments->is_feature_active( static::EXPERIMENT_NAME );
	}

	public function get_name(): string {
		return static::EXPERIMENT_NAME;
	}

	public function get_widgets(): array {
		return [
			'Contact_Buttons',
		];
	}

	public static function get_experimental_data(): array {
		return [
			'name' => static::EXPERIMENT_NAME,
			'title' => esc_html__( 'Floating Buttons', 'elementor' ),
			'description' => esc_html__( 'Boost visitor engagement with Floating Buttons. The Floating Button template library offers a variety of interactive one-click contact options, highlighted links, and calls to action to increase your website conversions.', 'elementor' ),
			'default' => Manager::STATE_INACTIVE,
			'release_status' => Manager::RELEASE_STATUS_BETA,
			'dependencies' => [
				'container',
			],
			'new_site' => [
				'default_active' => true,
				'minimum_installation_version' => '3.23.0',
			],
		];
	}

	private function register_admin_menu_legacy( Admin_Menu_Manager $admin_menu ) {
		$menu_args = $this->get_contact_menu_args();
		$function = $menu_args['function'];
		if ( is_callable( $function ) ) {
			$admin_menu->register( $menu_args['menu_slug'], new Floating_Buttons_Empty_View_Menu_Item( $function ) );
		} else {
			$admin_menu->register( $menu_args['menu_slug'], new Floating_Buttons_Menu_Item() );
		};

	}

	public function __construct() {
		parent::__construct();

		if ( $this->is_editing_existing_floating_buttons_page() || $this->is_creating_floating_buttons_page() ) {
			Controls_Manager::add_tab(
				Widget_Contact_Button_Base::TAB_ADVANCED,
				esc_html__( 'Advanced', 'elementor' )
			);
		}

		$this->register_contact_pages_cpt();

		if ( ! ElementorUtils::has_pro() ) {
			add_action( 'elementor/documents/register', function ( Documents_Manager $documents_manager ) {
				$documents_manager->register_document_type(
					static::FLOATING_BUTTONS_DOCUMENT_TYPE,
					Floating_Buttons::get_class_full_name()
				);
			} );
		}

		add_action( 'wp_ajax_elementor_send_clicks', [ $this, 'handle_click_tracking' ] );
		add_action( 'wp_ajax_nopriv_elementor_send_clicks', [ $this, 'handle_click_tracking' ] );

		add_action( 'elementor/controls/register', function ( Controls_Manager $controls_manager ) {
			$controls_manager->register( new Hover_Animation_Floating_Buttons() );
		});

		if ( ! ElementorUtils::has_pro() ) {
			add_action( 'wp_footer', function () {
				$this->render_floating_buttons();
			} );
		}

		add_action( 'elementor/common/localize_settings', function ( $settings ) {
			$settings['floatingButtons'] = [
				'nonce' => wp_create_nonce( static::CLICK_TRACKING_NONCE ),
				'ajaxurl' => admin_url( 'admin-ajax.php' ),
			];

			return $settings;
		} );

		add_action( 'elementor/admin-top-bar/is-active', function ( $is_top_bar_active, $current_screen ) {

			if ( strpos( $current_screen->id ?? '', static::CPT_FLOATING_BUTTONS ) !== false ) {
				return true;
			}

			return $is_top_bar_active;
		}, 10, 2 );

		add_action( 'elementor/admin/menu/register', function( Admin_Menu_Manager $admin_menu ) {
			$this->register_admin_menu_legacy( $admin_menu );
		}, Source_Local::ADMIN_MENU_PRIORITY + 20 );

		add_action( 'elementor/admin/localize_settings', function ( array $settings ) {
			return $this->admin_localize_settings( $settings );
		} );

		add_action( 'elementor/editor/localize_settings', function ( $data ) {
			return $this->editor_localize_settings( $data );
		} );

		add_filter( 'elementor/template_library/sources/local/register_taxonomy_cpts', function ( array $cpts ) {
			$cpts[] = static::CPT_FLOATING_BUTTONS;

			return $cpts;
		} );

		add_action( 'admin_init', function () {
			$action = filter_input( INPUT_GET, 'action' );
			$menu_args = $this->get_contact_menu_args();

			switch ( $action ) {
				case 'remove_from_entire_site':
					$post = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT );
					check_admin_referer( 'remove_from_entire_site_' . $post );
					delete_post_meta( $post, '_elementor_conditions' );
					wp_redirect( $menu_args['menu_slug'] );
					exit;
				case 'set_as_entire_site':
					$post = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT );
					check_admin_referer( 'set_as_entire_site_' . $post );

					$posts = get_posts( [
						'post_type' => static::CPT_FLOATING_BUTTONS,
						'posts_per_page' => -1,
						'post_status' => 'publish',
						'fields' => 'ids',
						'meta_key' => '_elementor_conditions',
						'meta_compare' => 'EXISTS',
					] );

					foreach ( $posts as $post_id ) {
						delete_post_meta( $post_id, '_elementor_conditions' );
					}

					update_post_meta( $post, '_elementor_conditions', [ 'include/general' ] );

					wp_redirect( $menu_args['menu_slug'] );
					exit;
				default:
					break;
			}
		} );

		add_action( 'manage_' . static::CPT_FLOATING_BUTTONS . '_posts_columns', function( $posts_columns ) {
			$source_local = Plugin::$instance->templates_manager->get_source( 'local' );
			unset( $posts_columns['date'] );
			unset( $posts_columns['comments'] );
			$posts_columns['click_tracking'] = esc_html__( 'Click Tracking', 'elementor' );

			if ( ! ElementorUtils::has_pro() ) {
				$posts_columns['instances'] = esc_html__( 'Instances', 'elementor' );
			}

			return $source_local->admin_columns_headers( $posts_columns );
		} );

		add_action(
			'manage_' . static::CPT_FLOATING_BUTTONS . '_posts_custom_column',
			[ $this, 'set_admin_columns_content' ],
			10,
			2
		);

		add_action( 'admin_bar_menu', function ( $admin_bar ) {

			$this->override_admin_bar_add_contact( $admin_bar );
		}, 100 );
	}

	public function handle_click_tracking() {
		$data = filter_input_array( INPUT_POST, [
			'clicks' => [
				'filter' => FILTER_VALIDATE_INT,
				'flags' => FILTER_REQUIRE_ARRAY,
			],
			'_nonce' => FILTER_UNSAFE_RAW,
		] );

		if ( ! wp_verify_nonce( $data['_nonce'], static::CLICK_TRACKING_NONCE ) ) {
			wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
		}

		if ( ! check_ajax_referer( static::CLICK_TRACKING_NONCE, '_nonce', false ) ) {
			wp_send_json_error( [ 'message' => 'Invalid referrer' ] );
		}

		$posts_to_update = [];

		foreach ( $data['clicks'] as $post_id ) {
			if ( ! isset( $posts_to_update[ $post_id ] ) ) {
				$starting_clicks = (int) get_post_meta( $post_id, static::META_CLICK_TRACKING, true );
				$posts_to_update[ $post_id ] = $starting_clicks ? $starting_clicks : 0;
			}
			$posts_to_update[ $post_id ] ++;
		}

		foreach ( $posts_to_update as $post_id => $clicks ) {
			update_post_meta( $post_id, static::META_CLICK_TRACKING, $clicks );
		}

		wp_send_json_success();
	}

	public function set_admin_columns_content( $column_name, $post_id ) {
		$document = Plugin::$instance->documents->get( $post_id );

		if ( method_exists( $document, 'admin_columns_content' ) ) {
			$document->admin_columns_content( $column_name );
		}

		switch ( $column_name ) {
			case 'click_tracking':
				$click_tracking = get_post_meta( $post_id, static::META_CLICK_TRACKING, true );
				echo esc_html( $click_tracking );
				break;
			case 'instances':
				if ( ElementorUtils::has_pro() ) {
					break;
				}
				$instances = get_post_meta( $post_id, '_elementor_conditions', true );
				if ( $instances ) {
					echo esc_html__( 'Entire Site', 'elementor' );
				}
				break;
			default:
				break;
		}
	}

	private function get_trashed_contact_posts(): array {
		if ( $this->trashed_contact_pages ) {
			return $this->trashed_contact_pages;
		}

		$this->trashed_contact_pages = $this->get_trashed_posts(
			static::CPT_FLOATING_BUTTONS,
			static::FLOATING_BUTTONS_DOCUMENT_TYPE
		);

		return $this->trashed_contact_pages;
	}

	private function get_trashed_posts( string $cpt, string $document_type ) {
		$query = new \WP_Query( [
			'no_found_rows' => true,
			'post_type' => $cpt,
			'post_status' => 'trash',
			'posts_per_page' => 1,
			'meta_key' => '_elementor_template_type',
			'meta_value' => $document_type,
		] );

		return $query->posts;
	}

	private function get_add_new_contact_page_url() {
		if ( ElementorUtils::has_pro() ) {
			return Plugin::$instance->documents->get_create_new_post_url(
				static::CPT_FLOATING_BUTTONS,
				static::FLOATING_BUTTONS_DOCUMENT_TYPE
			);
		}

		return Plugin::$instance->documents->get_create_new_post_url(
			static::CPT_FLOATING_BUTTONS,
			static::FLOATING_BUTTONS_DOCUMENT_TYPE
		) . '#library';
	}

	public function print_empty_contact_pages_page() {
		$template_sources = Plugin::$instance->templates_manager->get_registered_sources();
		$source_local = $template_sources['local'];
		$trashed_posts = $this->get_trashed_contact_posts();

		?>
		<div class="e-landing-pages-empty">
			<?php
			/** @var Source_Local $source_local */
			$source_local->print_blank_state_template(
				esc_html__( 'Floating Buttons', 'elementor' ),
				$this->get_add_new_contact_page_url(),
				esc_html__( 'Add a Contact button so your users can easily get in touch!', 'elementor' )
			);

			if ( ! empty( $trashed_posts ) ) : ?>
				<div class="e-trashed-items">
					<?php
					printf(
					/* translators: %1$s Link open tag, %2$s: Link close tag. */
						esc_html__( 'Or view %1$sTrashed Items%1$s', 'elementor' ),
						'<a href="' . esc_url( admin_url( 'edit.php?post_status=trash&post_type=' . self::CPT_FLOATING_BUTTONS ) ) . '">',
						'</a>'
					);
					?>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	private function admin_localize_settings( $settings ) {
		$contact_menu_slug = $this->get_contact_menu_args()['menu_slug'];

		if ( static::CPT_FLOATING_BUTTONS === $contact_menu_slug ) {
			$contact_menu_slug = 'admin.php?page=' . $contact_menu_slug;
		}

		$additional_settings = [
			'urls' => [
				'addNewLinkUrlContact' => $this->get_add_new_contact_page_url(),
				'viewContactPageUrl' => $contact_menu_slug,
			],
			'contactPages' => [
				'hasPages' => $this->has_contact_pages(),
			],
		];

		return array_replace_recursive( $settings, $additional_settings );
	}

	private function register_contact_pages_cpt() {
		$this->register_post_type(
			Floating_Buttons::get_labels(),
			static::CPT_FLOATING_BUTTONS
		);
	}

	private function is_editing_existing_floating_buttons_page() {
		$action = ElementorUtils::get_super_global_value( $_GET, 'action' );
		$post_id = ElementorUtils::get_super_global_value( $_GET, 'post' );

		return 'elementor' === $action && $this->is_floating_buttons_type_meta_key( $post_id );
	}

	private function is_creating_floating_buttons_page() {
		$action = ElementorUtils::get_super_global_value( $_POST, 'action' ); //phpcs:ignore WordPress.Security.NonceVerification.Missing
		$post_id = ElementorUtils::get_super_global_value( $_POST, 'editor_post_id' ); //phpcs:ignore WordPress.Security.NonceVerification.Missing

		return 'elementor_ajax' === $action && $this->is_floating_buttons_type_meta_key( $post_id );
	}

	private function is_floating_buttons_type_meta_key( $post_id ) {
		return static::FLOATING_BUTTONS_DOCUMENT_TYPE === get_post_meta( $post_id, Document::TYPE_META_KEY, true );
	}

	private function register_post_type( array $labels, string $cpt ) {
		$args = [
			'labels' => $labels,
			'public' => true,
			'show_in_menu' => 'edit.php?post_type=elementor_library&tabs_group=library',
			'capability_type' => 'page',
			'taxonomies' => [ Source_Local::TAXONOMY_TYPE_SLUG ],
			'supports' => [
				'title',
				'editor',
				'comments',
				'revisions',
				'trackbacks',
				'author',
				'excerpt',
				'page-attributes',
				'thumbnail',
				'custom-fields',
				'post-formats',
				'elementor',
			],
		];

		register_post_type( $cpt, $args );
	}

	private function has_contact_pages(): bool {
		if ( null !== $this->has_contact_pages ) {
			return $this->has_contact_pages;
		}

		$this->has_contact_pages = $this->has_pages(
			static::CPT_FLOATING_BUTTONS,
			static::FLOATING_BUTTONS_DOCUMENT_TYPE
		);

		return $this->has_contact_pages;
	}

	private function has_pages( string $cpt, string $document_type ): bool {
		$posts_query = new \WP_Query( [
			'no_found_rows' => true,
			'post_type' => $cpt,
			'post_status' => 'any',
			'posts_per_page' => 1,
			'meta_key' => '_elementor_template_type',
			'meta_value' => $document_type,
		] );

		return $posts_query->post_count > 0;

	}

	private function get_contact_menu_args(): array {
		if ( $this->has_contact_pages() ) {
			$menu_slug = static::ADMIN_PAGE_SLUG_CONTACT;
			$function = null;
		} else {
			$menu_slug = static::CPT_FLOATING_BUTTONS;
			$function = [ $this, 'print_empty_contact_pages_page' ];
		}

		return [
			'menu_slug' => $menu_slug,
			'function' => $function,
		];
	}

	public function override_admin_bar_add_contact( $admin_bar ): void {
		$new_contact_page_node = $admin_bar->get_node( 'new-e-floating-buttons' );

		if ( $new_contact_page_node ) {
			$new_contact_page_node->href = $this->get_add_new_contact_page_url();

			$admin_bar->add_node( $new_contact_page_node );
		}
	}

	private function editor_localize_settings( $data ) {
		$data['admin_floating_button_admin_url'] = admin_url( $this->get_contact_menu_args()['menu_slug'] );
		return $data;
	}

	private function render_floating_buttons(): void {
		if ( Plugin::$instance->preview->is_preview_mode() ) {
			$post_id = ElementorUtils::get_super_global_value( $_GET, 'elementor-preview' );
			$document = Plugin::$instance->documents->get( $post_id );

			if (
				$document instanceof Document &&
				$document->get_name() === static::FLOATING_BUTTONS_DOCUMENT_TYPE
			) {
				return;
			}
		}

		$query = new \WP_Query( [
			'post_type' => static::CPT_FLOATING_BUTTONS,
			'posts_per_page' => - 1,
			'post_status' => 'publish',
			'fields' => 'ids',
			'meta_key' => '_elementor_conditions',
			'meta_compare' => 'EXISTS',
		] );

		if ( ! $query->have_posts() ) {
			return;
		}

		foreach ( $query->posts as $post_id ) {
			$conditions = get_post_meta( $post_id, '_elementor_conditions', true );
			if ( ! $conditions ) {
				continue;
			}
			if ( in_array( 'include/general', $conditions ) ) {
				$document = Plugin::$instance->documents->get( $post_id );
				$document->print_content();
				break;
			}
		}
	}

}
