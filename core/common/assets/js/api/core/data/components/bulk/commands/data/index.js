import CommandData from 'elementor-api/modules/command-data';
/*
Excepted format:
Namespace will be used in the results of each command.
await $e.data.get( 'bulk/index', {
	commands: {
		// namespace: 'data command'.
		globals: 'globals/index',
		colors: 'globals/colors',
		color_primary: 'globals/colors?id=primary',
		no_cached: 'not-exist/endpoint',
	}
} );

`options.force = true` will force remote fetch.
*/
export class Index extends CommandData {
	// TODO: Create base internal command data.
	static getEndpointFormat() {
		// Format 'bulk/index' to 'bulk'.
		return 'bulk';
	}

	initialize() {
		this.cachedResults = {};
		this.requireRemote = false;
	}

	validateArgs( args = {} ) {
		const { query = {} } = args;

		this.requireArgumentConstructor( 'commands', Object, query );
	}

	/**
	 * Since $e.data does not know how to work with `query.commands` but only array, override `query.commands`.
	 * getRequestData method is used since, need to handle it before getRequestData() create the endpoint.
	 * Run over all query.commands:
	 * If they cached add it to `this.cachedResults`.
	 * If not Re-format commands, to be as excepted by $e.data.
	 */
	getRequestData() {
		const { query = {}, options = {} } = this.args,
			commandsArray = [];

		Object.entries( query.commands ).forEach( ( [ namespace, /*string*/ command ] ) => {
			let cache = false;

			if ( ! options.refresh ) {
				const extractedCommand = $e.data.commandExtractArgs( command ),
					assumedComponent = this.getComponent( extractedCommand.command );

				cache = assumedComponent?.getNamespace ? $e.data.getCache( assumedComponent, extractedCommand.command, extractedCommand.args.query ) : null;
			}
			if ( cache ) {
				this.cachedResults[ namespace ] = cache;
			} else {
				// Aka serialize.
				commandsArray.push( namespace + ':' + command );

				this.requireRemote = true;
			}
		} );

		query.commands = commandsArray;

		return super.getRequestData();
	}

	applyBeforeGet( args ) {
		const { options } = args;

		options.refresh = true;

		return args;
	}

	applyAfterGet( data, args = {} ) {
		// In other words, if remote require, merge result with cachedResults.
		if ( ! this.requireRemote ) {
			return super.applyAfterGet( data, args );
		}

		return Object.assign( data, this.cachedResults );
	}

	getComponent( command ) {
		/**
		 * TODO: Since getCache require component this temporary code, merge with commands-new-bases.
		 * After merge with branch use: CommandClass = $e.data.getCommandClass( extractedCommand.command ).getComponent().
		 */
		const commandParts = command.split( '/' );

		/**
		 * @type {string|ComponentBase}
		 */
		let assumedComponent = '';

		for ( const commandPart of commandParts ) {
			assumedComponent = commandPart;

			const temp = $e.components.get( assumedComponent );

			if ( temp ) {
				assumedComponent = temp;
				break;
			}

			assumedComponent.concat( '/' );
		}

		if ( ! assumedComponent.getNamespace ) {
			return null;
		}

		return assumedComponent;
	}
}
