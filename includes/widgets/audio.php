<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Audio extends Widget_Base {
	protected $_current_instance = [];

	public function get_id() {
		return 'audio';
	}

	public function get_title() {
		return __( 'SoundCloud', 'elementor' );
	}

	public function get_icon() {
		return 'settings';
	}

	protected function _register_controls() {
		$this->add_control(
			'section_title',
			[
				'label' => __( 'SoundCloud', 'elementor' ),
				'type' => Controls_Manager::SECTION,
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'elementor' ),
				'type' => Controls_Manager::URL,
				'default' => [
					'url' => 'https://soundcloud.com/shchxango/john-coltrane-1963-my-favorite',
				],
				'show_external' => false,
				'section' => 'section_title',
			]
		);

		$this->add_control(
			'visual',
			[
				'label' => __( 'Visual Player', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'no',
				'options' => [
					'yes' => __( 'Yes', 'elementor' ),
					'no' => __( 'No', 'elementor' ),
				],
				'section' => 'section_title',
			]
		);

		$this->add_control(
			'section_sc_options',
			[
				'label' => __( 'Additional Options', 'elementor' ),
				'type' => Controls_Manager::HEADING,
				'section' => 'section_title',
				'separator' => 'before',
			]
		);

		$this->add_control(
			'auto_play',
			[
				'label' => __( 'Autoplay', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'no',
				'options' => [
					'yes' => __( 'Yes', 'elementor' ),
					'no' => __( 'No', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'buying',
			[
				'label' => __( 'Buy button', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'liking',
			[
				'label' => __( 'Like button', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'download',
			[
				'label' => __( 'Download button', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'sharing',
			[
				'label' => __( 'Share button', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'show_comments',
			[
				'label' => __( 'Show Comments', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'show_playcount',
			[
				'label' => __( 'Play Counts', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'show_user',
			[
				'label' => __( 'Username', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'elementor' ),
					'hide' => __( 'Hide', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __( 'Controls Color', 'elementor' ),
				'type' => Controls_Manager::COLOR,
			]
		);


		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'elementor' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'soundcloud',
				'section' => 'section_title',
			]
		);
	}

	protected function render( $instance = [] ) {
		if ( empty( $instance['link'] ) )
			return;

		$this->_current_instance = $instance;

		add_filter( 'oembed_result', [ $this, 'filter_oembed_result' ], 50, 3 );
		$video_html = wp_oembed_get( $instance['link']['url'], wp_embed_defaults() );
		remove_filter( 'oembed_result', [ $this, 'filter_oembed_result' ], 50 );

		if ( $video_html ) : ?>
			<div class="elementor-soundcloud-wrapper">
				<?php echo $video_html; ?>
			</div>
		<?php endif;
	}

	public function filter_oembed_result( $html, $url, $args ) {
		$params = [];

		$params['url'] = $this->_current_instance['link']['url'];
		$params['auto_play'] = 'yes' === $this->_current_instance['auto_play'] ? 'true' : 'false';
		$params['buying'] = 'show' === $this->_current_instance['buying'] ? 'true' : 'false';
		$params['liking'] = 'show' === $this->_current_instance['liking'] ? 'true' : 'false';
		$params['download'] = 'show' === $this->_current_instance['download'] ? 'true' : 'false';
		$params['sharing'] = 'show' === $this->_current_instance['sharing'] ? 'true' : 'false';
		$params['show_comments'] = 'show' === $this->_current_instance['show_comments'] ? 'true' : 'false';
		$params['show_playcount'] = 'show' === $this->_current_instance['show_playcount'] ? 'true' : 'false';
		$params['show_user'] = 'show' === $this->_current_instance['show_user'] ? 'true' : 'false';

		$params['color'] = str_replace( '#', '', $this->_current_instance['color'] );
		$visual = 'yes' === $this->_current_instance['visual'] ? 'true' : 'false';

		if ( ! empty( $params ) ) {
			preg_match( '/<iframe.*src=\"(.*)\".*><\/iframe>/isU', $html, $matches );
			$url = esc_url( add_query_arg( $params, $matches[1] ) );

			$html = str_replace( $matches[1], $url, $html );
			$html = str_replace( 'visual=true', 'visual=' . $visual, $html );

			if ( 'false' === $visual ) {
				$html = str_replace( 'height="400"', 'height="200"', $html );
			}
		}

		return $html;
	}

	protected function content_template() {}
}
