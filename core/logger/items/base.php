<?php

namespace Elementor\Core\Logger\Items;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Base implements Log_Item_Interface {
	const FORMAT = 'date [type] message [meta]';
	const TRACE_FORMAT = '#key: file(line): class type function()';
	const TRACE_LIMIT = 5;

	protected $date;
	protected $type;
	protected $message;
	protected $meta = [];

	protected $times = 0;
	protected $times_dates = [];
	protected $args = [];

	public function __construct( $args ) {
		$this->date = current_time( 'mysql' );
		$this->message = empty( $args['message'] ) ? '' : $args['message'];
		$this->type = empty( $args['type'] ) ? 'info' : $args['type'];
		$this->meta = empty( $args['meta'] ) ? [] : $args['meta'];
		$this->args = $args;

		$this->set_trace();
	}

	public function __get( $name ) {
		if ( property_exists( $this, $name ) ) {
			return $this->{$name};
		}

		return '';
	}

	public function __toString() {
		$vars = get_object_vars( $this );
		return strtr( static::FORMAT, $vars );
	}

	public function to_formatted_string() {
		$vars = get_object_vars( $this );
		$format = str_replace( 'message', '<strong>message</strong>', static::FORMAT );
		if ( empty( $vars['meta'] ) ) {
			$format = str_replace( '[meta]', '', $format );
		} else {
			$vars['meta'] = stripslashes( var_export( $vars['meta'], true ) ); // @codingStandardsIgnoreLine
		}
		return strtr( $format, $vars );
	}

	public function get_fingerprint() {
		return md5( $this->type . $this->message . var_export( $this->meta, true ) ); // @codingStandardsIgnoreLine
	}

	public function increase_times( $item ) {
		$this->times++;
		$this->times_dates[] = $item->date;
	}

	public function format() {
		$trace = $this->format_trace();
		if ( empty( $trace ) ) {
			return $this->to_formatted_string();
	}
		$copy = clone $this;
		$copy->meta['trace'] = $trace;
		return $copy->to_formatted_string();
	}

	public function get_name() {
		return 'Log';
	}

	private function format_trace() {
		$trace = empty( $this->meta['trace'] ) ? '' : $this->meta['trace'];

		if ( is_string( $trace ) ) {
			return $trace;
		}

		$trace_str = '';
		foreach ( $trace as $key => $trace_line ) {
			$format = static::TRACE_FORMAT;
			$trace_line['key'] = $key;
			if ( empty( $trace_line['file'] ) ) {
				$format = str_replace( 'file(line): ', '', $format );
			}

			$trace_str .= PHP_EOL . strtr( $format, $trace_line );
			$trace_str .= empty( $trace_line['args'] ) ? '' : var_export( $trace_line['args'], true ); // @codingStandardsIgnoreLine
		}

		return $trace_str . PHP_EOL;
	}

	private function set_trace() {
		if ( ! empty( $this->args['trace'] ) && true === $this->args['trace'] ) {
			$limit = empty( $this->args['trace_limit'] ) ? static::TRACE_LIMIT : $this->args['trace_limit'];

			$stack = debug_backtrace( DEBUG_BACKTRACE_IGNORE_ARGS );// @codingStandardsIgnoreLine

			while ( ! empty( $stack ) && ! empty( $stack[0]['file'] ) && ( false !== strpos( $stack[0]['file'], 'core' . DIRECTORY_SEPARATOR . 'logger' ) ) ) {
				array_shift( $stack );
			}

			$this->meta['trace'] = array_slice( $stack, 0, $limit );
		} else {
			unset( $this->args['trace'] );
		}
	}

	public function __construct( $args ) {
		$this->date = current_time( 'mysql' );
		$this->message = $args['message'];
		$this->type = $args['type'];
		$this->meta = empty( $args['meta'] ) ? [] : $args['meta'];
		$this->args = $args;

		$this->set_trace();
	}
}
