import CommandBase from './command-base';

/**
 * To support pure callbacks in the API(commands.js), to ensure they have registered with the proper context.
 */
export default class CommandCallback extends CommandBase {
	static getInstanceType() {
		return 'CommandCallback';
	}

	/**
	 * Get original callback of the command.
	 *
	 * Support pure callbacks ( Non command-base ).
	 *
	 * @returns {(function())}
	 */
	static getCallback() {
		return this.registerConfig.callback;
	}

	apply( args = {} ) {
		return this.constructor.getCallback()( args );
	}
}
