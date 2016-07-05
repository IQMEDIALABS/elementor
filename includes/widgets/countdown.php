<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Countdown extends Widget_Base {

	public function get_id() {
		return 'countdown';
	}

	public function get_title() {
		return __( 'Countdown', 'elementor' );
	}

	public function get_icon() {
		return 'coding';
	}

	protected function _register_controls() {
		$this->add_control(
			'section_date',
			[
				'label' => __( 'Date', 'elementor' ),
				'type' => Controls_Manager::SECTION,
			]
		);

		$this->add_control(
			'day',
			[
				'label' => __( 'Day', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'min' => 1,
				'max' => 31,
				'section' => 'section_date',
			]
		);

		$this->add_control(
			'month',
			[
				'label' => __( 'Month', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'min' => 1,
				'max' => 12,
				'section' => 'section_date',
			]
		);

		$this->add_control(
			'year',
			[
				'label' => __( 'Year', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'min' => date( 'Y' ),
				'section' => 'section_date',
			]
		);

		$this->add_control(
			'section_time',
			[
				'label' => __( 'Time', 'elementor' ),
				'type' => Controls_Manager::SECTION,
			]
		);

		$this->add_control(
			'time',
			[
				'label' => __( 'Time', 'elementor' ),
				'type' => Controls_Manager::TIME,
				'section' => 'section_time',
			]
		);
	}

	protected function render( $instance = [] ) {
		$date = $instance['year'] . '/' . $instance['month'] . '/' . $instance['day'];
		$time = $instance['time']['hours'] . ':' . $instance['time']['minutes'];

		$new_date = new \DateTime( $date . ' ' . $time );
		?>
		<div class="elementor-countdown" data-deadline="<?php echo $new_date->format( 'Y-m-d H:i:s' ); ?>"></div>
	    <?php
	}

	protected function content_template() {}
}
