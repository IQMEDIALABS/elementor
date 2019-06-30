export default class extends elementorModules.Component {
	getNamespace() {
		return 'panel/history/actions';
	}

	getCommands() {
		return {
			undo: () => this.context.navigate(),
			redo: () => this.context.navigate( true ),
		};
	}

	getShortcuts() {
		return {
			undo: {
				keys: 'ctrl+z',
				exclude: [ 'input' ],
				scopes: [ 'preview', 'panel' ],
			},
			redo: {
				keys: 'ctrl+shift+z, ctrl+y',
				exclude: [ 'input' ],
				scopes: [ 'preview', 'panel' ],
			},
		};
	}
}
