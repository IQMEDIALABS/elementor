import CommandBase from 'elementor-api/modules/command-base';

export default class CommandsBase extends CommandBase {
	/**
	 * @inheritDoc
	 */
	initialize( args = {} ) {
		this.args = { ...this.args, store: true, ...args };
	}

	/**
	 * @inheritDoc
	 */
	validateArgs( args = {} ) {
		this.requireArgumentType( 'type', 'string', args );
		this.requireArgumentType( 'favorite', 'string', args );
	}
}
