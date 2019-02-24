import Commands from './commands';

export default class extends Commands {
	constructor( ...args ) {
		super( ...args );

		this.savedStates = {};
	}

	reload( route, args ) {
		const parts = route.split( '/' ),
			component = parts[ 0 ];

		this.close( component );

		this.to( route, args );
	}

	refreshComponent( component ) {
		const currentRoute = this.getCurrent( component ),
			currentArgs = this.getCurrentArgs( component );

		this.close( component );

		this.to( currentRoute, currentArgs );
	}

	close( component ) {
		delete this.current[ component ];
		delete this.currentArgs[ component ];
	}

	saveState( component ) {
		this.savedStates[ component ] = {
			route: this.current[ component ],
			args: this.currentArgs[ component ],
		};

		return this;
	}

	restoreState( component ) {
		if ( ! this.savedStates[ component ] ) {
			return false;
		}

		this.to( this.savedStates[ component ].route, this.savedStates[ component ].args );

		return true;
	}

	beforeRun( route, args ) {
		if ( this.is( route, args ) ) {
			return false;
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
	afterRun() {}

	error( message ) {
		throw Error( 'Route: ' + message );
	}

	is( route, args = {} ) {
		if ( ! super.is( route ) ) {
			return false;
		}

		const parts = route.split( '/' ),
			component = parts[ 0 ];

		return _.isEqual( args, this.currentArgs[ component ] );
	}

	isPartOf( route ) {
		/**
		 * Check against current command hierarchically.
		 * For example `is( 'panel' )` will be true for `panel/elements`
		 * `is( 'panel/editor' )` will be true for `panel/editor/style`
		 */
		const parts = route.split( '/' ),
			component = parts[ 0 ],
			toCheck = [],
			currentParts = this.current[ component ].split( '/' );

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
