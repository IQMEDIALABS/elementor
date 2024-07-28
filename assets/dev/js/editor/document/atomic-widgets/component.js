import ComponentBase from 'elementor-api/modules/component-base';
import * as commands from './commands/';
import * as commandsInternal from './commands-internal/';

export default class Component extends ComponentBase {
	// TODO
	static isActive() {
		return elementorCommon.config.experimentalFeatures.atomic_widgets;
	}

	getNamespace() {
		return 'document/atomic-widgets';
	}

	defaultCommands() {
		return this.importCommands( commands );
	}

	defaultCommandsInternal() {
		return this.importCommands( commandsInternal );
	}
}
