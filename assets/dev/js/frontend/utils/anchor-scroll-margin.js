module.exports = elementorModules.ViewModule.extend( {
	getDefaultSettings() {
		return {
			selectors: {
				links: '.elementor-element a[href*="#"]',
				stickyElements: '.elementor-element.elementor-sticky',
			},
		};
	},

	onInit() {
		const that = this;

		this.observeStickyElements( () => {
			that.initializeStickyAndAnchorTracking();
		} );
	},

	observeStickyElements( callback ) {
		const observer = new MutationObserver( ( mutationsList ) => {
			for ( const mutation of mutationsList ) {
				if ( 'childList' === mutation.type || ( 'attributes' === mutation.type && mutation.target.classList.contains( 'elementor-sticky' ) ) ) {
					callback();
				}
			}
		} );

		observer.observe( document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [ 'class', 'style' ],
		} );
	},

	initializeStickyAndAnchorTracking() {
		const anchorLinks = this.getAllAnchorLinks();
		const stickyElements = this.getAllStickyElements();
		const trackedElements = [];

		if ( stickyElements.length > 0 ) {
			this.trackStickyElements( stickyElements, trackedElements );
		}

		if ( anchorLinks.length > 0 ) {
			this.trackAnchorLinks( anchorLinks, trackedElements );
		}

		this.organizeStickyAndAnchors( trackedElements );
	},

	trackAnchorLinks( anchorLinks, trackedElements ) {
		anchorLinks.forEach( ( element ) => {
			const target = this.getAnchorTarget( element );
			const scrollPosition = this.getScrollPosition( target );
			trackedElements.push( {
				element: target,
				type: 'anchor',
				scrollPosition,
			} );
		} );
	},

	trackStickyElements( stickyElements, trackedElements ) {
		stickyElements.forEach( ( element ) => {
			const { sticky_anchor_link_offset: scrollMarginTop } = this.getElementSettings( element );
			if ( 0 === scrollMarginTop ) {
				return;
			}
			const scrollPosition = this.getScrollPosition( element );
			trackedElements.push( {
				scrollMarginTop,
				type: 'sticky',
				scrollPosition,
			} );
		} );
	},

	organizeStickyAndAnchors( elements ) {
		const stickyList = this.filterAndSortElementsByType( elements, 'sticky' );
		const anchorList = this.filterAndSortElementsByType( elements, 'anchor' );

		stickyList.forEach( ( sticky, index ) => {
			this.defineCurrentStickyRange( sticky, index, stickyList, anchorList );
		} );
	},

	defineCurrentStickyRange( sticky, index, stickyList, anchorList ) {
		const nextStickyScrollPosition = ( index + 1 < stickyList.length )
			? stickyList[ index + 1 ].scrollPosition
			: Infinity;
		sticky.anchor = anchorList.filter( ( anchor ) => {
			const withinRange = anchor.scrollPosition > sticky.scrollPosition && anchor.scrollPosition < nextStickyScrollPosition;
			if ( withinRange ) {
				anchor.element.style.scrollMarginTop = `${ sticky.scrollMarginTop }px`;
			}
			return withinRange;
		} );
	},

	getScrollPosition( element ) {
		let offsetTop = 0;

		while ( element ) {
			offsetTop += element.offsetTop;
			element = element.offsetParent;
		}

		return offsetTop;
	},

	getAllStickyElements() {
		const allStickyElements = document.querySelectorAll( this.getSettings( 'selectors.stickyElements' ) );

		return Array.from( allStickyElements ).filter( ( anchor, index, self ) =>
			index === self.findIndex( ( t ) => t.getAttribute( 'data-id' ) === anchor.getAttribute( 'data-id' ) ),
		);
	},

	getAllAnchorLinks() {
		const allAnchors = document.querySelectorAll( this.getSettings( 'selectors.links' ) );

		return Array.from( allAnchors ).filter( ( anchor, index, self ) =>
			index === self.findIndex( ( t ) => t.getAttribute( 'href' ) === anchor.getAttribute( 'href' ) ),
		);
	},

	filterAndSortElementsByType( elements, type ) {
		return elements
			.filter( ( item ) => type === item.type )
			.sort( ( a, b ) => a.scrollPosition - b.scrollPosition );
	},

	isValidSelector( hash ) {
		const validSelectorPattern = /^#[A-Za-z_][\w-]*$/;
		return validSelectorPattern.test( hash );
	},

	getAnchorTarget( element ) {
		if ( ! this.isValidSelector( element.hash ) ) {
			// eslint-disable-next-line no-console
			console.warn( `Invalid selector: '${ element.hash }'` );

			return null;
		}

		return document.querySelector( element.hash );
	},

	getElementSettings( element ) {
		return JSON.parse( element.getAttribute( 'data-settings' ) );
	},
} );
