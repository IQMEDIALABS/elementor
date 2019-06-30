import environment from './environment';

export default class Shortcuts {
	constructor( $window ) {
		this.specialKeys = {
			13: 'enter',
			27: 'esc',
			38: 'up',
			40: 'down',
			46: 'del',
			191: '?',
		};

		this.component = '';
		this.handlers = {};

		this.bindListener( $window );
	}

	bindListener( $window ) {
		$window.on( 'keydown', ( event ) => this.handle( event ) );
	}

	getAll() {
		const shortcuts = {};
		jQuery.each( this.handlers, ( key, handler ) => {
			jQuery.each( handler, ( index, config ) => {
				shortcuts[ config.command ] = key;
			} );
		} );

		return shortcuts;
	}

	/**
	 * @param shortcuts
	 * @param {Object} args
	 * @param {callback} args.callback Required
	 * @param {string} args.component Optional
	 * @param {callback} args.dependency Optional
	 * @param {array} args.exclude Optional
	 * @param {bool} args.allowAltKey Optional
	 */
	register( shortcuts, args ) {
		shortcuts.replace( ' ', '' ).split( ',' ).forEach( ( shortcut ) => {
			if ( ! this.handlers[ shortcut ] ) {
				this.handlers[ shortcut ] = [];
			}

			this.handlers[ shortcut ].push( args );
		} );
	}

	handle( event ) {
		const handlers = this.getHandlersByPriority( event );

		if ( ! handlers ) {
			return;
		}

		jQuery.each( handlers, ( key, handler ) => {
			if ( handler.scopes && ! this.inScope( handler.scopes ) ) {
				return;
			}

			if ( handler.dependency && ! handler.dependency( event ) ) {
				return;
			}

			if ( handler.exclude && -1 !== handler.exclude.indexOf( 'input' ) ) {
				const $target = jQuery( event.target );

				if ( $target.is( ':input, .elementor-input' ) || $target.closest( '[contenteditable="true"]' ).length ) {
					return;
				}
			}

			// Fix for some keyboard sources that consider alt key as ctrl key
			if ( ! handler.allowAltKey && event.altKey ) {
				return;
			}

			event.preventDefault();

			handler.callback( event );
		} );
	}

	setComponent( component ) {
		this.component = component;
	}

	isControlEvent( event ) {
		return event[ environment.mac ? 'metaKey' : 'ctrlKey' ];
	}

	getEventShortcut( event ) {
		const shortcut = [];

		if ( event.altKey ) {
			shortcut.push( 'alt' );
		}

		if ( this.isControlEvent( event ) ) {
			shortcut.push( 'ctrl' );
		}

		if ( event.shiftKey ) {
			shortcut.push( 'shift' );
		}

		if ( this.specialKeys[ event.which ] ) {
			shortcut.push( this.specialKeys[ event.which ] );
		} else {
			shortcut.push( String.fromCharCode( event.which ).toLowerCase() );
		}

		return shortcut.join( '+' );
	}

	inScope( scopes ) {
		return scopes.some( ( scope ) => {
			if ( elementorCommon.route.isPartOf( scope ) ) {
				return true;
			}
		} );
	}

	getHandlersByPriority( event ) {
		const handlers = this.handlers[ this.getEventShortcut( event ) ];

		if ( ! handlers ) {
			return false;
		}

		const activeComponents = Object.keys( elementorCommon.components.activeComponents ),
			byPriority = [],
			scopes = {};

		jQuery.each( handlers, ( key, handler ) => {
			if ( handler.scopes ) {
				handler.scopes.forEach( ( scope ) => scopes[ scope ] = handler );
			}
		} );

		for ( let i = activeComponents.length - 1; 0 <= i; i-- ) {
			if ( scopes[ activeComponents[ i ] ] ) {
				byPriority.push( scopes[ activeComponents[ i ] ] );
				return byPriority;
			}
		}

		return handlers;
	}
}
