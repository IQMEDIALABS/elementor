<?php
namespace Elementor;

use Elementor\Core\Settings\Page\Manager as PageManager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor typography control.
 *
 * A base control for creating typography control. Displays input fields to define
 * the content typography including font size, font family, font weight, text
 * transform, font style, line height and letter spacing.
 *
 * @since 1.0.0
 */
class Group_Control_Typography extends Group_Control_Base {

	/**
	 * Fields.
	 *
	 * Holds all the typography control fields.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @static
	 *
	 * @var array Typography control fields.
	 */
	protected static $fields;

	/**
	 * Scheme fields keys.
	 *
	 * Holds all the typography control scheme fields keys.
	 * Default is an array containing `font_family` and `font_weight`.
	 *
	 * @since 1.0.0
	 * @access private
	 * @static
	 *
	 * @var array Typography control scheme fields keys.
	 */
	private static $_scheme_fields_keys = [ 'font_family', 'font_weight' ];

	/**
	 * Get scheme fields keys.
	 *
	 * Retrieve all the available typography control scheme fields keys.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return array Scheme fields keys.
	 */
	public static function get_scheme_fields_keys() {
		return self::$_scheme_fields_keys;
	}

	/**
	 * Get typography control type.
	 *
	 * Retrieve the control type, in this case `typography`.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string Control type.
	 */
	public static function get_type() {
		return 'typography';
	}

	/**
	 * Init fields.
	 *
	 * Initialize typography control fields.
	 *
	 * @since 1.2.2
	 * @access protected
	 *
	 * @return array Control fields.
	 */
	protected function init_fields() {
		$fields = [];

		$kit = Plugin::$instance->kits_manager->get_active_kit_for_frontend();

		/**
		 * Retrieve the settings directly from DB, because of an open issue when a controls group is being initialized
		 * from within another group
		 */
		$kit_settings = $kit->get_meta( PageManager::META_KEY );

		$default_fonts = isset( $kit_settings['default_generic_fonts'] ) ? $kit_settings['default_generic_fonts'] : 'Sans-serif';

		if ( $default_fonts ) {
			$default_fonts = ', ' . $default_fonts;
		}

		$fields['font_family'] = [
			'label' => esc_html_x( 'Family', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::FONT,
			'default' => '',
			'selector_value' => 'font-family: "{{VALUE}}"' . $default_fonts . ';',
		];

		$fields['font_size'] = [
			'label' => esc_html_x( 'Size', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'size_units' => [ 'px', 'em', 'rem', 'vw' ],
			'range' => [
				'px' => [
					'min' => 1,
					'max' => 200,
				],
				'vw' => [
					'min' => 0.1,
					'max' => 10,
					'step' => 0.1,
				],
			],
			'responsive' => true,
			'selector_value' => 'font-size: {{SIZE}}{{UNIT}}',
		];

		$fields['font_weight'] = [
			'label' => esc_html_x( 'Weight', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'100' => '100',
				'200' => '200',
				'300' => '300',
				'400' => '400',
				'500' => '500',
				'600' => '600',
				'700' => '700',
				'800' => '800',
				'900' => '900',
				'' => esc_html__( 'Default', 'elementor' ),
				'normal' => esc_html__( 'Normal', 'elementor' ),
				'bold' => esc_html__( 'Bold', 'elementor' ),
			],
		];

		$fields['text_transform'] = [
			'label' => esc_html_x( 'Transform', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => esc_html__( 'Default', 'elementor' ),
				'uppercase' => esc_html_x( 'Uppercase', 'Typography Control', 'elementor' ),
				'lowercase' => esc_html_x( 'Lowercase', 'Typography Control', 'elementor' ),
				'capitalize' => esc_html_x( 'Capitalize', 'Typography Control', 'elementor' ),
				'none' => esc_html_x( 'Normal', 'Typography Control', 'elementor' ),
			],
		];

		$fields['font_style'] = [
			'label' => _x( 'Style', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => esc_html__( 'Default', 'elementor' ),
				'normal' => esc_html_x( 'Normal', 'Typography Control', 'elementor' ),
				'italic' => esc_html_x( 'Italic', 'Typography Control', 'elementor' ),
				'oblique' => esc_html_x( 'Oblique', 'Typography Control', 'elementor' ),
			],
		];

		$fields['text_decoration'] = [
			'label' => esc_html_x( 'Decoration', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => esc_html__( 'Default', 'elementor' ),
				'underline' => esc_html_x( 'Underline', 'Typography Control', 'elementor' ),
				'overline' => esc_html_x( 'Overline', 'Typography Control', 'elementor' ),
				'line-through' => esc_html_x( 'Line Through', 'Typography Control', 'elementor' ),
				'none' => esc_html_x( 'None', 'Typography Control', 'elementor' ),
			],
		];

		$fields['line_height'] = [
			'label' => esc_html_x( 'Line-Height', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'desktop_default' => [
				'unit' => 'em',
			],
			'tablet_default' => [
				'unit' => 'em',
			],
			'mobile_default' => [
				'unit' => 'em',
			],
			'range' => [
				'px' => [
					'min' => 1,
				],
			],
			'responsive' => true,
			'size_units' => [ 'px', 'em' ],
			'selector_value' => 'line-height: {{SIZE}}{{UNIT}}',
		];

		$fields['letter_spacing'] = [
			'label' => esc_html_x( 'Letter Spacing', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'range' => [
				'px' => [
					'min' => -5,
					'max' => 10,
					'step' => 0.1,
				],
			],
			'responsive' => true,
			'selector_value' => 'letter-spacing: {{SIZE}}{{UNIT}}',
		];

		$fields['word_spacing'] = [
			'label' => esc_html_x( 'Word Spacing', 'Typography Control', 'elementor' ),
			'type' => Controls_Manager::SLIDER,
			'desktop_default' => [
				'unit' => 'em',
			],
			'tablet_default' => [
				'unit' => 'em',
			],
			'mobile_default' => [
				'unit' => 'em',
			],
			'size_units' => [ 'px', 'em' ],
			'range' => [
				'px' => [
					'step' => 1,
				],
				'em' => [
					'step' => 0.1,
				],
			],
			'responsive' => true,
			'selector_value' => 'word-spacing: {{SIZE}}{{UNIT}}',
		];

		return $fields;
	}

	/**
	 * Prepare fields.
	 *
	 * Process typography control fields before adding them to `add_control()`.
	 *
	 * @since 1.2.3
	 * @access protected
	 *
	 * @param array $fields Typography control fields.
	 *
	 * @return array Processed fields.
	 */
	protected function prepare_fields( $fields ) {
		array_walk(
			$fields, function( &$field, $field_name ) {

				if ( in_array( $field_name, [ 'typography', 'popover_toggle' ] ) ) {
					return;
				}

				$selector_value = ! empty( $field['selector_value'] ) ? $field['selector_value'] : str_replace( '_', '-', $field_name ) . ': {{VALUE}};';

				$field['selectors'] = [
					'{{SELECTOR}}' => $selector_value,
				];
			}
		);

		return parent::prepare_fields( $fields );
	}

	/**
	 * Add group arguments to field.
	 *
	 * Register field arguments to typography control.
	 *
	 * @since 1.2.2
	 * @access protected
	 *
	 * @param string $control_id Typography control id.
	 * @param array  $field_args Typography control field arguments.
	 *
	 * @return array Field arguments.
	 */
	protected function add_group_args_to_field( $control_id, $field_args ) {
		$field_args = parent::add_group_args_to_field( $control_id, $field_args );

		$field_args['groupPrefix'] = $this->get_controls_prefix();
		$field_args['groupType'] = 'typography';

		$args = $this->get_args();

		if ( in_array( $control_id, self::get_scheme_fields_keys() ) && ! empty( $args['scheme'] ) ) {
			$field_args['scheme'] = [
				'type' => self::get_type(),
				'value' => $args['scheme'],
				'key' => $control_id,
			];
		}

		return $field_args;
	}

	/**
	 * Get default options.
	 *
	 * Retrieve the default options of the typography control. Used to return the
	 * default options while initializing the typography control.
	 *
	 * @since 1.9.0
	 * @access protected
	 *
	 * @return array Default typography control options.
	 */
	protected function get_default_options() {
		return [
			'popover' => [
				'starter_name' => 'typography',
				'starter_title' => esc_html_x( 'Typography', 'Typography Control', 'elementor' ),
				'settings' => [
					'render_type' => 'ui',
					'groupType' => 'typography',
					'global' => [
						'active' => true,
					],
				],
			],
		];
	}
}
