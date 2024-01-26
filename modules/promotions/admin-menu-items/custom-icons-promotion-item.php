<?php

namespace Elementor\Modules\Promotions\AdminMenuItems;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Custom_Icons_Promotion_Item extends Base_Promotion_Item {
	public function get_name() {
		return 'custom_icons';
	}


	public function get_label() {
		return esc_html__( 'Custom Icons', 'elementor' );
	}

	public function get_page_title() {
		return esc_html__( 'Custom Icons', 'elementor' );
	}

	public function get_promotion_title() {
		return esc_html__( 'Add Your Custom Icons', 'elementor' );
	}

	public function get_promotion_description() {
		return esc_html__(
			'Don\'t rely solely on the FontAwesome icons everyone else is using! Differentiate your website and your style with custom icons you can upload from your favorite icons source.',
			'elementor'
		);
	}

	/**
	 * @deprecated use get_promotion_description instead
	 * @return void
	 */
	public function render_promotion_description() {
		echo $this->get_promotion_description(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	public function get_cta_url() {
		return 'https://go.elementor.com/go-pro-custom-icons/';
	}
}
