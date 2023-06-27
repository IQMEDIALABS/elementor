<?php
namespace Elementor\Modules\DevTools;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class BacktraceHelper {
	/**
	 * find_who_called_me
	 * Retrieves the function, class, file, line, type and name of the function that called the function that called this function.
	 *
	 * @param  int $stack_depth The depth of the stack to look for.
	 * @return array
	 */
	public static function find_who_called_me( $stack_depth ) {
		$backtrace = debug_backtrace( DEBUG_BACKTRACE_IGNORE_ARGS );

		$caller = $backtrace[ $stack_depth ];
		$caller_function = $caller['function'];
		$caller_class = $caller['class'];
		$caller_file = $caller['file'] ?? '';
		$caller_line = $caller['line'] ?? '';
		$source = self::get_source( $caller_file );

		$res = array(
			'function' => $caller_function,
			'class' => $caller_class,
			'file' => $caller_file,
			'line' => $caller_line,
			'type' => $source['type'],
			'name' => $source['name'],
		);
		return $res;
	}

	private static function get_source( $filename ) {
		$file = str_replace( WP_CONTENT_DIR, '', $filename, $is_in_content );
		$name = 'Unknown';
		$type = '';
		if ( 1 === $is_in_content ) {
			$root_folder = explode( '/', $file );
			$type = $root_folder[1];
			$name = $root_folder[2];
		}
		return [
			'name' => $name,
			'type' => $type,
		];
	}
}
