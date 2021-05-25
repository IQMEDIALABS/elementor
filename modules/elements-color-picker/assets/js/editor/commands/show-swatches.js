import CommandBase from 'elementor-api/modules/command-base';
import { rgbToHex } from 'elementor/core/app/assets/js/utils/utils';

export class ShowSwatches extends CommandBase {
	constructor( args ) {
		super( args );

		this.colors = {};

		this.classes = {
			picker: 'e-element-color-picker',
			tooltip: 'e-element-color-picker__tooltip',
			swatch: 'e-element-color-picker__swatch',
			hidden: 'e-picker-hidden',
		};

		this.selectors = {
			picker: `.${ this.classes.picker }`,
			tooltip: `.${ this.classes.tooltip }`,
		};

		this.container = null;
		this.backgroundImages = [];
	}

	/**
	 * Validate the command arguments.
	 *
	 * @param args
	 */
	validateArgs( args ) {
		this.requireArgument( 'event', args );
	}

	/**
	 * Execute the command.
	 *
	 * @param args
	 */
	apply( args ) {
		const { event: e } = args;
		const id = e.currentTarget.dataset.id;

		// Calculate swatch location.
		const rect = e.currentTarget.getBoundingClientRect(),
			x = Math.round( e.clientX - rect.left ) + 'px',
			y = Math.round( e.clientY - rect.top ) + 'px';

		this.container = elementor.getContainer( id );

		const activePicker = elementor.$previewContents[ 0 ].querySelector( this.selectors.picker );

		// If there is a picker already, remove it.
		if ( activePicker ) {
			jQuery( activePicker ).tipsy( 'hide' );
			activePicker.remove();
		}

		e.stopPropagation();

		// Hack to wait for the images to load before picking the colors from it
		// when extracting colors from a background image control.
		// TODO: Find a better solution.
		setTimeout( () => {
			const isImage = ( 'img' === e.target.tagName.toLowerCase() );

			if ( isImage ) {
				this.extractColorsFromImage( e.target );
			} else {
				this.extractColorsFromSettings();
				this.extractColorsFromImages();
			}

			this.initSwatch( x, y );
		}, 100 );
	}

	/**
	 * Extract colors from color controls of the current selected element.
	 */
	extractColorsFromSettings() {
		// Iterate over the widget controls.
		Object.keys( this.container.settings.attributes ).map( ( control ) => {
			// Limit colors count.
			if ( this.reachedColorsLimit() ) {
				return;
			}

			if ( ! ( control in this.container.controls ) ) {
				return;
			}

			const isColor = ( 'color' === this.container.controls[ control ]?.type );
			const isBgImage = control.includes( 'background_image' );

			// Determine if the current control is active.
			const isActive = () => {
				return ( elementor.helpers.isActiveControl( this.container.controls[ control ], this.container.settings.attributes ) );
			};

			// Throw non-color and non-background-image controls.
			if ( ! isColor && ! isBgImage ) {
				return;
			}

			// Throw non-active controls.
			if ( ! isActive() ) {
				return;
			}

			// Handle background images.
			if ( isBgImage ) {
				this.addTempBackgroundImage( this.container.getSetting( control ) );
				return;
			}

			let value = this.container.getSetting( control );

			if ( value && ! Object.values( this.colors ).includes( value ) ) {
				// If it's a global color, it will return a css variable which needs to be resolved to a HEX value.
				const pattern = /var\(([^)]+)\)/i;
				const matches = value.match( pattern );

				if ( matches ) {
					value = getComputedStyle( this.container.view.$el[ 0 ] ).getPropertyValue( matches[ 1 ].trim() );
				}

				this.colors[ control ] = value;
			}
		} );
	}

	/**
	 * Create a temporary image element in order to extract colors from it using ColorThief.
	 * Used with background images from background controls.
	 *
	 * @param url
	 */
	addTempBackgroundImage( { url } ) {
		if ( ! url ) {
			return;
		}

		// Create the image.
		const img = document.createElement( 'img' );
		img.src = url;

		// Push the image to the temporary images array.
		this.backgroundImages.push( img );
	}

	/**
	 * Extract colors from image and push it ot the colors array.
	 *
	 * @param {Object} image    The image element to extract colors from
	 * @param {String} suffix   An optional suffix for the key in the colors array.
	 */
	extractColorsFromImage( image, suffix = '' ) {
		const colorThief = new ColorThief();
		let palette;

		try {
			palette = colorThief.getPalette( image );
		} catch ( e ) {
			return;
		}

		// Add the palette to the colors array.
		palette.forEach( ( color, index ) => {
			const hex = rgbToHex( color[ 0 ], color[ 1 ], color[ 2 ] );

			// Limit colors count.
			if ( this.reachedColorsLimit() ) {
				return;
			}

			if ( ! Object.values( this.colors ).includes( hex ) ) {
				this.colors[ `palette-${ suffix }-${ index }` ] = hex;
			}
		} );
	}

	/**
	 * Iterate over all images in the current selected element and extract colors from them.
	 */
	extractColorsFromImages() {
		// Iterate over all images in the widget.
		const images = this.backgroundImages;

		images.forEach( ( img, i ) => {
			this.extractColorsFromImage( img, i );
		} );

		this.backgroundImages = [];
	}

	/**
	 * Add the color swatches to a picker container.
	 *
	 * @param {HTMLElement} picker - Picker HTML element to append the swatches to.
	 *
	 * @returns {void}
	 */
	addColorSwatches( picker ) {
		Object.entries( this.colors ).map( ( [ control, value ] ) => {
			const swatch = document.createElement( 'div' );
			swatch.classList.add( this.classes.swatch );
			swatch.style = `--color: ${ value }`;
			swatch.dataset.text = value.replace( '#', '' );

			swatch.addEventListener( 'mouseenter', () => {
				$e.run( 'elements-color-picker/enter-preview', { value } );
			} );

			swatch.addEventListener( 'mouseleave', () => {
				$e.run( 'elements-color-picker/exit-preview' );
			} );

			swatch.addEventListener( 'click', ( e ) => {
				$e.run( 'elements-color-picker/apply', {
					value,
					trigger: {
						palette: picker,
						swatch: e.target,
					},
				} );

				e.stopPropagation();
			} );

			picker.append( swatch );
		} );
	}

	/**
	 * Add a tooltip to a picker container.
	 *
	 * @param {HTMLElement} picker - Picker HTML element to add the tooltip to.
	 *
	 * @returns {void}
	 */
	addTooltip( picker ) {
		jQuery( picker ).tipsy( {
			gravity: 's',
			className: this.classes.tooltip,
			trigger: 'manual',
			title: () => {
				return __( 'Select a color from any image, or from an element whose color you\'ve manually defined.', 'elementor' );
			},
		} ).tipsy( 'show' );

		// Hack to move Tipsy to the preview wrapper because it defaults to the editor's `document.body`.
		// TODO: Use something other than Tipsy.
		const tooltip = document.querySelector( this.selectors.tooltip );
		elementor.$previewWrapper[ 0 ].appendChild( tooltip );

		// Hack to prevent hover on tooltip triggering a `mouseleave` event on the preview wrapper.
		tooltip.style.pointerEvents = 'none';
	}

	/**
	 * Initialize the swatch with the color palette, using x & y positions, relative to the parent.
	 *
	 * @param x
	 * @param y
	 */
	initSwatch( x = 0, y = 0 ) {
		const count = Object.entries( this.colors ).length;

		const picker = document.createElement( 'div' );
		picker.dataset.count = count;
		picker.classList.add( this.classes.picker, this.classes.hidden );
		picker.style = `
			--count: ${ count };
			--left: ${ x };
			--top: ${ y };
		`;

		// Append the swatch before adding colors to it in order to avoid the click event of the swatches,
		// which will fire the `apply` command and will close everything.
		this.container.view.$el[ 0 ].append( picker );

		// Check if the picker is overflowing out of the parent.
		const observer = elementorModules.utils.Scroll.scrollObserver( {
			callback: ( event ) => {
				observer.unobserve( picker );

				if ( ! event.isInViewport ) {
					picker.style.setProperty( '--left', 'unset' );
					picker.style.setProperty( '--right', '0' );
				}

				picker.classList.remove( this.classes.hidden );
			},
			root: this.container.view.$el[ 0 ],
			offset: `0px -${ parseInt( picker.getBoundingClientRect().width ) }px 0px`,
		} );

		observer.observe( picker );

		if ( 0 === count ) {
			// Show a Tipsy tooltip.
			this.addTooltip( picker );
		} else {
			// Add the colors swatches.
			this.addColorSwatches( picker );
		}

		// Remove the picker on mouse leave.
		this.container.view.$el[ 0 ].addEventListener( 'mouseleave', () => {
			jQuery( picker ).tipsy( 'hide' );

			// Remove only after the animation has finished.
			setTimeout( () => {
				picker.remove();
			}, 300 );
		}, { once: true } );
	}

	/**
	 * Check if the palette reached its colors limit.
	 *
	 * @returns {boolean}
	 */
	reachedColorsLimit() {
		const COLORS_LIMIT = 5;

		return ( COLORS_LIMIT <= Object.keys( this.colors ).length );
	}
}
