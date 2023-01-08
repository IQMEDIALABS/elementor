import Base from './base';

export default class BaseNestedTabs extends Base {
	/**
	 * @param {string|number} tabIndex
	 *
	 * @return {string}
	 */
	getTabTitleFilterSelector( tabIndex ) {
		return `[data-tab="${ tabIndex }"]`;
	}

	/**
	 * @param {string|number} tabIndex
	 *
	 * @return {string}
	 */
	getTabContentFilterSelector( tabIndex ) {
		return `[data-tab="${ tabIndex }"]`;
	}

	/**
	 * @param {HTMLElement} tabTitleElement
	 *
	 * @return {string}
	 */
	getTabIndex( tabTitleElement ) {
		return tabTitleElement.getAttribute( 'data-tab' );
	}

	getDefaultSettings() {
		return {
			selectors: {
				tablist: '[role="tablist"]',
				tabTitle: '.e-n-tab-title',
				tabContent: '.e-con',
			},
			classes: {
				active: 'e-active',
			},
			showTabFn: 'show',
			hideTabFn: 'hide',
			toggleSelf: false,
			hidePrevious: true,
			autoExpand: true,
			keyDirection: {
				ArrowLeft: elementorFrontendConfig.is_rtl ? 1 : -1,
				ArrowUp: -1,
				ArrowRight: elementorFrontendConfig.is_rtl ? -1 : 1,
				ArrowDown: 1,
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$tabTitles: this.findElement( selectors.tabTitle ),
			$tabContents: this.findElement( selectors.tabContent ),
		};
	}

	activateDefaultTab() {
		const settings = this.getSettings();

		if ( ! settings.autoExpand || ( 'editor' === settings.autoExpand && ! this.isEdit ) ) {
			return;
		}

		const defaultActiveTab = this.getEditSettings( 'activeItemIndex' ) || 1,
			originalToggleMethods = {
				showTabFn: settings.showTabFn,
				hideTabFn: settings.hideTabFn,
			};

		// Toggle tabs without animation to avoid jumping
		this.setSettings( {
			showTabFn: 'show',
			hideTabFn: 'hide',
		} );

		this.changeActiveTab( defaultActiveTab );

		// Return back original toggle effects
		this.setSettings( originalToggleMethods );
	}

	handleKeyboardNavigation( event ) {
		const tab = event.currentTarget,
			$tabList = jQuery( tab.closest( this.getSettings( 'selectors' ).tablist ) ),
			// eslint-disable-next-line @wordpress/no-unused-vars-before-return
			$tabs = $tabList.find( this.getSettings( 'selectors' ).tabTitle ),
			isVertical = 'vertical' === $tabList.attr( 'aria-orientation' );

		switch ( event.key ) {
			case 'ArrowLeft':
			case 'ArrowRight':
				if ( isVertical ) {
					return;
				}
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				if ( ! isVertical ) {
					return;
				}
				event.preventDefault();
				break;
			case 'Home':
				event.preventDefault();
				$tabs.first().trigger( 'focus' );
				return;
			case 'End':
				event.preventDefault();
				$tabs.last().trigger( 'focus' );
				return;
			default:
				return;
		}

		const tabIndex = tab.getAttribute( 'data-tab' ) - 1,
			direction = this.getSettings( 'keyDirection' )[ event.key ],
			nextTab = $tabs[ tabIndex + direction ];

		if ( nextTab ) {
			nextTab.focus();
		} else if ( -1 === tabIndex + direction ) {
			$tabs.last().trigger( 'focus' );
		} else {
			$tabs.first().trigger( 'focus' );
		}
	}

	deactivateActiveTab( tabIndex ) {
		const settings = this.getSettings(),
			activeClass = settings.classes.active,
			activeTitleFilter = tabIndex ? this.getTabTitleFilterSelector( tabIndex ) : '.' + activeClass,
			activeContentFilter = tabIndex ? this.getTabContentFilterSelector( tabIndex ) : '.' + activeClass,
			$activeTitle = this.elements.$tabTitles.filter( activeTitleFilter ),
			$activeContent = this.elements.$tabContents.filter( activeContentFilter );

		$activeTitle.add( $activeContent ).removeClass( activeClass );
		$activeTitle.attr( {
			tabindex: '-1',
			'aria-selected': 'false',
			'aria-expanded': 'false',
		} );

		$activeContent[ settings.hideTabFn ]();
		$activeContent.attr( 'hidden', 'hidden' );
	}

	activateTab( tabIndex ) {
		const settings = this.getSettings(),
			activeClass = settings.classes.active,
			$requestedTitle = this.elements.$tabTitles.filter( this.getTabTitleFilterSelector( tabIndex ) ),
			$requestedContent = this.elements.$tabContents.filter( this.getTabContentFilterSelector( tabIndex ) ),
			animationDuration = 'show' === settings.showTabFn ? 0 : 400;

		$requestedTitle.add( $requestedContent ).addClass( activeClass );
		$requestedTitle.attr( {
			tabindex: '0',
			'aria-selected': 'true',
			'aria-expanded': 'true',
		} );

		$requestedContent[ settings.showTabFn ](
			animationDuration,
			() => {
				elementorFrontend.elements.$window.trigger( 'elementor-pro/motion-fx/recalc' );
				elementorFrontend.elements.$window.trigger( 'elementor/nested-tabs/activate', $requestedContent );
			},
		);
		$requestedContent.removeAttr( 'hidden' );
	}

	isActiveTab( tabIndex ) {
		return this.elements.$tabTitles.filter( '[data-tab="' + tabIndex + '"]' ).hasClass( this.getSettings( 'classes.active' ) );
	}

	bindEvents() {
		this.elements.$tabTitles.on( {
			keydown: ( event ) => {
				// Support for old markup that includes an `<a>` tag in the tab
				if ( jQuery( event.target ).is( 'a' ) && `Enter` === event.key ) {
					event.preventDefault();
				}

				// We listen to keydowon event for these keys in order to prevent undesired page scrolling
				if ( [ 'End', 'Home', 'ArrowUp', 'ArrowDown' ].includes( event.key ) ) {
					this.handleKeyboardNavigation( event );
				}
			},
			keyup: ( event ) => {
				switch ( event.code ) {
					case 'ArrowLeft':
					case 'ArrowRight':
						this.handleKeyboardNavigation( event );
						break;
					case 'Enter':
					case 'Space':
						event.preventDefault();
						this.changeActiveTab( event.currentTarget.getAttribute( 'data-tab' ), true );
						break;
				}
			},
			click: ( event ) => {
				event.preventDefault();
				this.changeActiveTab( event.currentTarget.getAttribute( 'data-tab' ), true );
			},
		} );

		elementorFrontend.elements.$window.on( 'elementor/nested-tabs/activate', this.reInitSwipers );
	}

	/**
	 * Fixes issues where Swipers that have been initialized while a tab is not visible are not properly rendered
	 * and when switching to the tab the swiper will not respect any of the chosen `autoplay` related settings.
	 *
	 * This is triggered when switching to a nested tab, looks for Swipers in the tab content and reinitializes them.
	 *
	 * @param {Object} event   - Incoming event.
	 * @param {Object} content - Active nested tab dom element.
	 */
	reInitSwipers( event, content ) {
		const swiperElements = content.querySelectorAll( '.swiper-container' );
		for ( const element of swiperElements ) {
			if ( ! element.swiper ) {
				return;
			}
			element.swiper.initialized = false;
			element.swiper.init();
		}
	}

	onInit( ...args ) {
		super.onInit( ...args );

		this.activateDefaultTab();
	}

	onEditSettingsChange( propertyName, value ) {
		if ( 'activeItemIndex' === propertyName ) {
			this.changeActiveTab( value, false );
		}
	}

	/**
	 * @param {string}  tabIndex
	 * @param {boolean} fromUser - Whether the call is caused by the user or internal.
	 */
	changeActiveTab( tabIndex, fromUser = false ) {
		// `document/repeater/select` is used only in edit mod, and only when its not internal call,
		// in other words only in editor and when user triggered the change.
		if ( fromUser && this.isEdit ) {
			return window.top.$e.run( 'document/repeater/select', {
				container: elementor.getContainer( this.$element.attr( 'data-id' ) ),
				index: parseInt( tabIndex ),
			} );
		}

		const isActiveTab = this.isActiveTab( tabIndex ),
			settings = this.getSettings();

		if ( ( settings.toggleSelf || ! isActiveTab ) && settings.hidePrevious ) {
			this.deactivateActiveTab();
		}

		if ( ! settings.hidePrevious && isActiveTab ) {
			this.deactivateActiveTab( tabIndex );
		}

		if ( ! isActiveTab ) {
			this.activateTab( tabIndex );
		}
	}
}
