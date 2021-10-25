import CommandContainerBase from 'elementor-editor/command-bases/command-container-base';

export class ToggleSelection extends CommandContainerBase {
	validateArgs( args ) {
		this.requireContainer( args );
	}

	apply( args ) {
		const { containers = [ args.container ], append = false } = args;

		containers.forEach( ( container ) => {
			$e.run(
				elementor.selection.has( container ) && append ?
					'document/elements/deselect' :
					'document/elements/select',
				args
			);
		} );
	}
}

export default ToggleSelection;
