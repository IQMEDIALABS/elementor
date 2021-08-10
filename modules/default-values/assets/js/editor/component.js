import * as commands from './commands/index';
import * as dataCommands from './commands-data/index';
import GlobalValues from './handlers/global-values';
import LocalValues from './handlers/local-values';

export default class Component extends $e.modules.ComponentBase {
	getNamespace() {
		return 'default-values';
	}

	defaultCommands() {
		return this.importCommands( commands );
	}

	defaultData() {
		return this.importCommands( dataCommands );
	}

	addContextMenuItem( groups, view ) {
		return groups.map( ( group ) => {
			if ( group.name !== 'save' ) {
				return group;
			}

			group.actions = [
				...group.actions,
				{
					name: 'save-as-default',
					title: __( 'Save as Default', 'elementor' ),
					isEnabled: () => true,
					callback: () => $e.run( 'default-values/create', { container: view.getContainer() } ),
				},
			];

			return group;
		} );
	}

	__construct( args = {} ) {
		/**
		 * Handlers responsible for the different strategies to manipulate and getting the settings
		 * from local values or globals
		 *
		 * @type {BaseHandler[]} BaseHandler path: './handlers/base-handler'
		 */
		this.handlers = [
			new LocalValues(), // Must be first to allow the globals change the settings data.
			new GlobalValues(),
		];

		elementor.hooks.addFilter( 'elements/widget/contextMenuGroups', this.addContextMenuItem );

		super.__construct( args );
	}
}
