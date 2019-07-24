class ImageCarouselHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				carousel: '.elementor-image-carousel-wrapper',
				slideContent: '.swiper-slide',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		const elements = {
			$carousel: this.$element.find( selectors.carousel ),
		};

		elements.$swiperSlides = elements.$carousel.find( selectors.slideContent );

		return elements;
	}

	getSlidesCount() {
		return this.elements.$swiperSlides.length;
	}

	getSwiperSettings() {
		const elementSettings = this.getElementSettings(),
			slidesToShow = +elementSettings.slides_to_show || 3,
			isSingleSlide = 1 === slidesToShow,
			defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
			elementorBreakpoints = elementorFrontend.config.breakpoints;

		const swiperOptions = {
			slidesPerView: slidesToShow,
			slidesPerGroup: +elementSettings.slides_to_scroll || 1,
			loop: 'yes' === elementSettings.infinite,
			speed: elementSettings.speed,
		};

		swiperOptions.breakpoints = {};

		swiperOptions.breakpoints[ elementorBreakpoints.md ] = {
			slidesPerView: +elementSettings.slides_to_show_mobile || 1,
			slidesPerGroup: +elementSettings.slides_to_scroll_mobile || 1,
		};

		swiperOptions.breakpoints[ elementorBreakpoints.lg ] = {
			slidesPerView: +elementSettings.slides_to_show_tablet || defaultLGDevicesSlidesCount,
			slidesPerGroup: +elementSettings.slides_to_scroll_tablet || defaultLGDevicesSlidesCount,
		};

		if ( ! this.isEdit && elementSettings.autoplay ) {
			swiperOptions.autoplay = {
				delay: elementSettings.autoplay_speed,
				disableOnInteraction: !! elementSettings.pause_on_interaction,
			};
		}

		if ( true === swiperOptions.loop ) {
			swiperOptions.loopedSlides = this.getSlidesCount();
		}

		if ( elementSettings.image_spacing_custom ) {
			swiperOptions.spaceBetween = elementSettings.image_spacing_custom.size;
		}

		const showArrows = 'arrows' === elementSettings.navigation || 'both' === elementSettings.navigation;
		const showDots = 'dots' === elementSettings.navigation || 'both' === elementSettings.navigation;

		if ( showArrows ) {
			swiperOptions.navigation = {
				prevEl: '.elementor-swiper-button-prev',
				nextEl: '.elementor-swiper-button-next',
			};
		}

		if ( showDots ) {
			swiperOptions.pagination = {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
			};
		}

		return swiperOptions;
	}

	getSpaceBetween() {
		var propertyName = 'image_spacing_custom';

		return this.getElementSettings( propertyName ).size || 0;
	}

	updateSpaceBetween( swiper ) {
		var newSpaceBetween = this.getSpaceBetween();

		swiper.params.spaceBetween = newSpaceBetween;

		swiper.update();
	}

	onInit( ...args ) {
		super.onInit( ...args );

		if ( ! this.elements.$carousel.length ) {
			return;
		}

		this.swiper = new Swiper( this.elements.$carousel, this.getSwiperSettings() );
	}

	onElementChange( propertyName ) {
		if ( 0 === propertyName.indexOf( 'width' ) ) {
			this.swiper.update();
		}

		if ( 0 === propertyName.indexOf( 'image_spacing_custom' ) ) {
			this.updateSpaceBetween( this.swiper, propertyName );
		}
	}

	onEditSettingsChange( propertyName ) {
		if ( 0 === propertyName.indexOf( 'width' ) ) {
			this.swiper.update();
		}

		if ( 'activeItemIndex' === propertyName ) {
			this.swiper.slideToLoop( this.getEditSettings( 'activeItemIndex' ) - 1 );
		}
	}
}

export default ( $scope ) => {
	elementorFrontend.elementsHandler.addHandler( ImageCarouselHandler, { $element: $scope } );
};
