<?php

namespace Elementor\Modules\AtomicWidgets;

use Elementor\Modules\AtomicWidgets\Base\Style_Transformer_Base;
use Elementor\Core\Files\CSS\Post;
use Elementor\Element_Base;
use Elementor\Modules\AtomicWidgets\Base\Atomic_Widget_Base;
use Elementor\Modules\AtomicWidgets\Styles\Styles_Renderer;
use Elementor\Modules\AtomicWidgets\Styles\Transformers\Array_Transformer;
use Elementor\Modules\AtomicWidgets\Styles\Transformers\Size_Transformer;
use Elementor\Plugin;

class Widget_Styles {
	/**
	 * @var array<string, Style_Transformer_Base> $transformers
	 */
	private array $style_transformers = [];

	/**
	 * @var array<string, array{type: string, width: int}> $breakpoints
	 */
	private array $breakpoints = [];

	public function register_hooks() {
		add_filter(
			'elementor/atomic-widgets/styles/transformers',
			fn ( array $transformers) => $this->register_style_transformers( $transformers )
		);
		add_action( 'elementor/element/parse_css', fn( Post $post, Element_Base $element ) => $this->parse_atomic_widget_css( $post, $element ), 10, 2 );
	}

	/**
	 * @param array<int, Style_Transformer_Base> $transformers
	 * @return array<string, Style_Transformer_Base>
	 */
	private function register_style_transformers( array $transformers ): array {
		array_push(
			$transformers,
			new Size_Transformer(),
			new Array_Transformer(),
		);

		return $transformers;
	}

	private function get_style_transformers(): array {
		if ( count( $this->style_transformers ) === 0 ) {
			$this->style_transformers = $this->build_style_transformers();
		}

		return $this->style_transformers;
	}

	private function build_style_transformers(): array {
		$transformers = apply_filters( 'elementor/atomic-widgets/styles/transformers', [] );

		$transformers_map = [];

		foreach ( $transformers as $transformer ) {
			$transformers_map[ $transformer->type() ] = $transformer;
		}

		return $transformers_map;
	}

	private function get_breakpoints(): array {
		if ( count( $this->breakpoints ) === 0 ) {
			$this->breakpoints = $this->build_breakpoints();
		}

		return $this->breakpoints;
	}

	private function build_breakpoints(): array {
		$breakpoints_config = Plugin::$instance->breakpoints->get_breakpoints_config();

		$min_width = [];
		$max_width = [];
		$defaults = [
			[
				'id' => 'desktop',
				'label' => __( 'Desktop', 'elementor' ),
			],
		];

		foreach ( $breakpoints_config as $id => $v1_breakpoint ) {
			if ( ! $v1_breakpoint['is_enabled'] ) {
				continue;
			}

			$breakpoint = [
				'id' => $id,
				'label' => $v1_breakpoint['label'],
				'width' => $v1_breakpoint['value'],
				'type' => 'min' === $v1_breakpoint['direction'] ? 'min-width' : 'max-width',
			];

			if ( ! $breakpoint['width'] ) {
				$defaults[] = $breakpoint;
			} elseif ( 'min-width' === $breakpoint['type'] ) {
				$min_width[] = $breakpoint;
			} else {
				$max_width[] = $breakpoint;
			}
		}

		usort($min_width, function ( $a, $b ) {
			return $b['width'] - $a['width'];
		});

		usort($max_width, function ( $a, $b ) {
			return $b['width'] - $a['width'];
		});

		$sorted_breakpoints = array_merge( $min_width, $defaults, $max_width );

		$breakpoints_map = [];
		foreach ( $sorted_breakpoints as $breakpoint ) {
			$breakpoints_map[ $breakpoint['id'] ] = $breakpoint;
		}

		return $breakpoints_map;
	}

	private function parse_atomic_widget_css( Post $post, Element_Base $element ) {
		$transformers = $this->get_style_transformers();
		$breakpoints = $this->get_breakpoints();

		if ( ! ( $element instanceof Atomic_Widget_Base ) || Post::class !== get_class( $post ) ) {
			return;
		}

		$styles = $element->get_raw_data()['styles'];

		if ( empty( $styles ) ) {
			return;
		}

		$styles_renderer = new Styles_Renderer( [
			'transformers' => $transformers,
			'breakpoints' => $breakpoints,
		] );
		$css = $styles_renderer->render( $styles );

		$post->get_stylesheet()->add_raw_css( $css );
	}
}
