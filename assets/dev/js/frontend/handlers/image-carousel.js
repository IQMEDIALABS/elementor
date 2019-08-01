class ImageCarouselHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				carousel: '.elementor-image-carousel',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$carousel: this.$element.find( selectors.carousel ),
		};
	}

	onInit( ...args ) {
		super.onInit( ...args );

		const elementSettings = this.getElementSettings(),
			slidesToShow = +elementSettings.slides_to_show || 3,
			isSingleSlide = 1 === slidesToShow,
			defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
			breakpoints = elementorFrontend.config.breakpoints;

		const slickOptions = {
			slidesToShow: slidesToShow,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplay_speed,
			infinite: 'yes' === elementSettings.infinite,
			pauseOnHover: 'yes' === elementSettings.pause_on_hover,
			speed: elementSettings.speed,
			arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
			dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
			rtl: 'rtl' === elementSettings.direction,
			responsive: [
				{
					breakpoint: breakpoints.lg,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_tablet || defaultLGDevicesSlidesCount,
						slidesToScroll: +elementSettings.slides_to_scroll_tablet || defaultLGDevicesSlidesCount,
					},
				},
				{
					breakpoint: breakpoints.md,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_mobile || 1,
						slidesToScroll: +elementSettings.slides_to_scroll_mobile || 1,
					},
				},
			],
		};

		if ( isSingleSlide ) {
			slickOptions.fade = 'fade' === elementSettings.effect;
		} else {
			slickOptions.slidesToScroll = +elementSettings.slides_to_scroll || defaultLGDevicesSlidesCount;
		}

		this.elements.$carousel.slick( slickOptions );
	}
}

export default ( $scope ) => {
	elementorFrontend.elementsHandler.addHandler( ImageCarouselHandler, { $element: $scope } );
};
