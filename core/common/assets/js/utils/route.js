import Commands from './commands';

export default class extends Commands {
	constructor( ...args ) {
		super( ...args );

		this.containers = {};
		this.savedStates = {};
	}

	registerContainer( container, args = {} ) {
		this.containers[ container ] = args;

		if ( args.open ) {
			this.registerDependency( container, () => {
				return this.open( container );
			} );
		}

		return this;
	}

	open( container ) {
		const args = this.containers[ container ];

		if ( ! args ) {
			return;
		}

		if ( ! args.isOpen ) {
			args.isOpen = args.open.apply();
			this.containers[ container ].isOpen = args.isOpen;
		}

		return args.isOpen;
	}

	close( container ) {
		const args = this.containers[ container ];

		if ( ! args ) {
			return;
		}

		if ( args.close ) {
			args.close.apply( this );
		}

		this.containers[ container ].isOpen = false;

		this.clearCurrent( container );

		return this;
	}

	reload( route, args ) {
		const parts = route.split( '/' ),
			container = parts[ 0 ];

		this.clearCurrent( container );

		this.to( route, args );
	}

	refreshContainer( container ) {
		const currentRoute = this.getCurrent( container ),
			currentArgs = this.getCurrentArgs( container );

		this.clearCurrent( container );

		this.to( currentRoute, currentArgs );
	}

	clearCurrent( container ) {
		const route = this.current[ container ];
		delete this.current[ container ];
		delete this.currentArgs[ container ];
		this.getComponent( route ).onCloseRoute();
	}

	saveState( container ) {
		this.savedStates[ container ] = {
			route: this.current[ container ],
			args: this.currentArgs[ container ],
		};

		return this;
	}

	restoreState( container ) {
		if ( ! this.savedStates[ container ] ) {
			return false;
		}

		this.to( this.savedStates[ container ].route, this.savedStates[ container ].args );

		return true;
	}

	beforeRun( route, args ) {
		if ( this.is( route, args ) ) {
			return false;
		}

		const parts = route.split( '/' ),
			container = parts[ 0 ];

		if ( this.current[ container ] ) {
			this.getComponent( this.current[ container ] ).onCloseRoute();
		}

		return super.beforeRun( route, args );
	}

	to( route, args ) {
		this.run( route, args );
	}

	// Don't use the event object.
	runShortcut( command ) {
		this.to( command );
	}

	// Don't clear current route.
	afterRun( route, args ) {
		this.getComponent( route ).onRoute( args );
	}

	error( message ) {
		throw Error( 'Route: ' + message );
	}

	is( route, args = {} ) {
		if ( ! super.is( route ) ) {
			return false;
		}

		const parts = route.split( '/' ),
			container = parts[ 0 ];

		return _.isEqual( args, this.currentArgs[ container ] );
	}

	isPartOf( route ) {
		/**
		 * Check against current command hierarchically.
		 * For example `is( 'panel' )` will be true for `panel/elements`
		 * `is( 'panel/editor' )` will be true for `panel/editor/style`
		 */
		const parts = route.split( '/' ),
			container = parts[ 0 ],
			toCheck = [],
			currentParts = this.current[ container ] ? this.current[ container ].split( '/' ) : [];

		let match = false;

		currentParts.forEach( ( part ) => {
			toCheck.push( part );
			if ( toCheck.join( '/' ) === route ) {
				match = true;
			}
		} );

		return match;
	}
}
