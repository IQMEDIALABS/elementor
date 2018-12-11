<?php

namespace Elementor\Core\Logger\Items;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class PHP extends File {

	const FORMAT = "PHP: date [type X times][meta][file::line]<br>message";

	public function get_name() {
		return 'PHP';
	}
}
