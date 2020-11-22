<?php

namespace Elementor\Core\Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Base Object
 *
 * Base class that provides basic settings handling functionality.
 *
 * @since 2.3.0
 */
class Base_Object {

	/**
	 * Settings.
	 *
	 * Holds the object settings.
	 *
	 * @access private
	 *
	 * @var array
	 */
	private $settings;

	/**
	 * Get Settings.
	 *
	 * @since 2.3.0
	 * @access public
	 *
	 * @param string $setting Optional. The key of the requested setting. Default is null.
	 *
	 * @return mixed An array of all settings, or a single value if `$setting` was specified.
	 */
	final public function get_settings( $setting = null ) {
		$this->ensure_settings();

		return self::get_items( $this->settings, $setting );
	}

	/**
	 * Set settings.
	 *
	 * @since 2.3.0
	 * @access public
	 *
	 * @param array|string $key   If key is an array, the settings are overwritten by that array. Otherwise, the
	 *                            settings of the key will be set to the given `$value` param.
	 *
	 * @param mixed        $value Optional. Default is null.
	 */
	final public function set_settings( $key, $value = null ) {
		$this->ensure_settings();

		if ( is_array( $key ) ) {
			$this->settings = $key;
		} else {
			$this->settings[ $key ] = $value;
		}
	}

	/**
	 * Delete setting.
	 *
	 * Deletes the settings array or a specific key of the settings array if `$key` is specified.
	 * @since 2.3.0
	 * @access public
	 *
	 * @param string $key Optional. Default is null.
	 */
	public function delete_setting( $key = null ) {
		if ( $key ) {
			unset( $this->settings[ $key ] );
		} else {
			$this->settings = [];
		}
	}

	final public function merge_properties( array $default_props, array $custom_props, array $allowed_props_keys = [] ) {
		$props = array_replace_recursive( $default_props, $custom_props );

		if ( $allowed_props_keys ) {
			$props = array_intersect_key( $props, array_flip( $allowed_props_keys ) );
		}

		return $props;
	}

	/**
	 * Get items.
	 *
	 * Utility method that receives an array with a needle and returns all the
	 * items that match the needle. If needle is not defined the entire haystack
	 * will be returned.
	 *
	 * @since 2.3.0
	 * @access protected
	 * @static
	 *
	 * @param array  $haystack An array of items.
	 * @param string $needle   Optional. Needle. Default is null.
	 *
	 * @return mixed The whole haystack or the needle from the haystack when requested.
	 */
	final protected static function get_items( array $haystack, $needle = null ) {
		if ( $needle ) {
			return isset( $haystack[ $needle ] ) ? $haystack[ $needle ] : null;
		}

		return $haystack;
	}

	/**
	 * Get init settings.
	 *
	 * Used to define the default/initial settings of the object. Inheriting classes may implement this method to define
	 * their own default/initial settings.
	 *
	 * @since 2.3.0
	 * @access protected
	 *
	 * @return array
	 */
	protected function get_init_settings() {
		return [];
	}

	/**
	 * Ensure settings.
	 *
	 * Ensures that the `$settings` member is initialized
	 *
	 * @since 2.3.0
	 * @access private
	 */
	private function ensure_settings() {
		if ( null === $this->settings ) {
			$this->settings = $this->get_init_settings();
		}
	}

	/**
	 * Has Own Method
	 *
	 * Used for check whether the method passed as a parameter was declared in the current instance or inherited.
	 * If a base_class_name is passed, it checks whether the method was created in that class. If the method was declared
	 * in the base_class_name, it returns false. Otherwise (method was not declared in base_class_name), it returns true.
	 *
	 * @since 3.1.0
	 *
	 * @param string $method_name
	 * @param string $base_class_name
	 *
	 * @return bool True if the method was declared by the current instance, False if it was inherited.
	 */
	public function has_own_method( $method_name, $base_class_name = null ) {
		try {
			$reflection_method = new \ReflectionMethod( $this, $method_name );

			// If a ReflectionMethod is successfully created, get its declaring class.
			$declaring_class = $reflection_method->getDeclaringClass();
		} catch ( \Exception $e ) {
			return false;
		}

		if ( $base_class_name ) {
			return $base_class_name !== $declaring_class->name;
		}

		return get_called_class() === $declaring_class->name;
	}
}
