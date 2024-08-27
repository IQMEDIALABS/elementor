<?php
namespace Elementor\Modules\AtomicWidgets\Base;

use Elementor\Modules\AtomicWidgets\Controls\Section;
use Elementor\Modules\AtomicWidgets\Module as AtomicWidgetsModule;
use Elementor\Modules\AtomicWidgets\Schema\Atomic_Prop;
use Elementor\Utils;
use Elementor\Modules\AtomicWidgets\Settings_Provider;
use Elementor\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

abstract class Atomic_Widget_Base extends Widget_Base {
	protected $version = '0.0';
	protected $styles = [];

	public function __construct( $data = [], $args = null ) {
		parent::__construct( $data, $args );

		$this->version = $data['version'] ?? '0.0';
		$this->styles = $data['styles'] ?? [];
	}

	public function get_atomic_controls() {
		$controls = $this->define_atomic_controls();

		return $this->get_valid_controls( $controls );
	}

	private function get_valid_controls( array $controls ): array {
		$valid_controls = [];
		$schema = static::get_props_schema();

		foreach ( $controls as $control ) {
			if ( $control instanceof Section ) {
				$cloned_section = clone $control;

				$cloned_section->set_items(
					$this->get_valid_controls( $control->get_items() )
				);

				$valid_controls[] = $cloned_section;
				continue;
			}

			if ( ! ( $control instanceof Atomic_Control_Base ) ) {
				Utils::safe_throw( 'Control must be an instance of `Atomic_Control_Base`.' );
				continue;
			}

			$prop_name = $control->get_bind();

			if ( ! $prop_name ) {
				Utils::safe_throw( 'Control is missing a bound prop from the schema.' );
				continue;
			}

			if ( ! array_key_exists( $prop_name, $schema ) ) {
				Utils::safe_throw( "Prop `{$prop_name}` is not defined in the schema of `{$this->get_name()}`." );
				continue;
			}

			$valid_controls[] = $control;
		}

		return $valid_controls;
	}

	abstract protected function define_atomic_controls(): array;

	final public function get_controls( $control_id = null ) {
		if ( ! empty( $control_id ) ) {
			return null;
		}

		return [];
	}

	final public function get_initial_config() {
		$config = parent::get_initial_config();

		$config['atomic_controls'] = $this->get_atomic_controls();
		$config['atomic_props_schema'] = static::get_props_schema();
		$config['version'] = $this->version;

		return $config;
	}

	final public function get_data_for_save() {
		$data = parent::get_data_for_save();

		$data['version'] = $this->version;

		return $data;
	}

	final public function get_raw_data( $with_html_content = false ) {
		$raw_data = parent::get_raw_data( $with_html_content );

		$raw_data['styles'] = $this->styles;

		return $raw_data;
	}

	final public function get_stack( $with_common_controls = true ) {
		return [
			'controls' => [],
			'tabs' => [],
		];
	}

	final public function get_atomic_settings(): array {
		return Settings_Provider::instance()->transform(
			$this->get_settings(),
			static::get_props_schema()
		);
	}

	public static function get_props_schema() {
		$schema = static::define_props_schema();

		static::validate_schema( $schema );

		return $schema;
	}

	// TODO: Move to a `Schema_Validator` class?
	private static function validate_schema( array $schema ) {
		$widget_name = static::class;

		foreach ( $schema as $key => $prop ) {
			if ( ! ( $prop instanceof Atomic_Prop ) ) {
				Utils::safe_throw( "Prop `$key` must be an instance of `Atomic_Prop` in `{$widget_name}`." );
			}

			if ( ! $prop->get_type() ) {
				Utils::safe_throw( "Prop `$key` must have a type in `{$widget_name}`." );
			}

			$prop_type = AtomicWidgetsModule::instance()->prop_types->get( $prop->get_type() );

			if ( ! $prop_type ) {
				Utils::safe_throw( "Prop type `{$prop->get_type()}` for prop `$key` does not exist in `{$widget_name}`." );
			}

			try {
				$prop->validate( $prop->get_default() );
			} catch ( \Exception $e ) {
				Utils::safe_throw( "Default value for `$key` prop is invalid in `{$widget_name}` - {$e->getMessage()}" );
			}
		}
	}

	abstract protected static function define_props_schema(): array;
}
