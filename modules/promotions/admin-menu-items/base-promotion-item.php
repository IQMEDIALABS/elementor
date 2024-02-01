<?php

namespace Elementor\Modules\Promotions\AdminMenuItems;

use Elementor\Core\Utils\Promotions\Validate_Promotion;
use Elementor\Modules\Promotions\AdminMenuItems\Interfaces\Promotion_Menu_Item;
use Elementor\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

abstract class Base_Promotion_Item implements Promotion_Menu_Item {

	public function get_name() {
		return 'base_promotion';
	}

	public function is_visible() {
		return true;
	}

	public function get_parent_slug() {
		return Settings::PAGE_ID;
	}

	public function get_capability() {
		return 'manage_options';
	}

	public function get_cta_text() {
		return esc_html__( 'Upgrade Now', 'elementor' );
	}

	public function get_image_url() {
		return ELEMENTOR_ASSETS_URL . 'images/go-pro-wp-dashboard.svg';
	}

	public function get_promotion_description() {
		return '';
	}

	public function render() {
		$config = [
			'title' => $this->get_promotion_title(),
			'description' => $this->get_promotion_description(),
			'image' => $this->get_image_url(),
			'upgrade_text' => $this->get_cta_text(),
			'upgrade_url' => $this->get_cta_url(),
		];

		$config = apply_filters( 'elementor/' . $this->get_name() . '/custom_promotion', $config );

		if ( isset( $config['upgrade_url'] ) && false === Validate_Promotion::domain_is_on_elementor_dot_com( $config['upgrade_url'] ) ) {
			$config['upgrade_url'] = esc_url( $this->get_cta_url() );
		}

		?>
		<div class="wrap">
			<div class="elementor-blank_state">
				<img src="<?php echo esc_url( $config['image'] ?? $this->get_image_url() ); ?>" loading="lazy" />

				<h3><?php echo esc_html( $config['title'] ?? $this->get_promotion_title() ); ?></h3>
				{{ if( $config['description'] ?? $this->get_promotion_description() ) }}
				<p><?php echo esc_html( $config['description'] ?? $this->get_promotion_description() ?? '' ); ?></p>
				{{ endif }}
				<a class="elementor-button go-pro" href="<?php echo esc_url( $config['upgrade_url'] ?? $this->get_cta_url() ); ?>">
					<?php echo esc_html( $config['upgrade_text'] ?? $this->get_cta_text() ); ?>
				</a>
			</div>
		</div>
		<?php
	}
}
