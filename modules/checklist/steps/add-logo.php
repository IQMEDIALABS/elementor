<?php

namespace Elementor\Modules\Checklist\Steps;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Add_Logo extends Step_Base {
	const STEP_ID = 'add_logo';

	public function get_id() : string {
		return self::STEP_ID;
	}

	public function is_absolute_completed() : bool {
		return has_custom_logo();
	}

	public function get_title() : string {
		return esc_html__( 'Add your logo', 'elementor' );
	}

	public function get_description() : string {
		return esc_html__( 'Let\'s start by adding your logo and filling in the site identity settings. This will establish your initial presence and also improve SEO.', 'elementor' );
	}

	public function get_cta_text() : string {
		return esc_html__( 'Go to Site Identity', 'elementor' );
	}

	public function get_cta_url() : string {
		$link = $this->wordpress_adapter->get_referer();

		if (!$link) {
			return '';
		}

		$additional_params = [
			'active-document' => 5,
			'active-tab' => 'settings-site-identity',
		];

		return add_query_arg($additional_params, $link);
	}

	public function get_is_completion_immutable() : bool {
		return false;
	}

	public function get_image_src() : string {
		return 'https://assets.elementor.com/checklist/v1/images/checklist-step-1.jpg';
	}

	public function get_learn_more_url() : string {
		return 'http://go.elementor.com/app-website-checklist-logo-article';
	}
}
