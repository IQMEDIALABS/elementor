import CommandBase from 'elementor-api/modules/command-base';

export class Copy extends CommandBase {
	validateArgs( args ) {
		this.requireContainer( args );
	}

	apply( args ) {
		const { storageKey = 'clipboard', containers = [ args.container ] } = args;

		if ( ! elementor.selectedElementsAreOfSameType() ) {
			elementor.notifications.showToast( {
				message: __( 'Oops, you can’t copy this selection because it contains different element types.', 'elementor' ),
			} );

			return false;
		}

		elementorCommon.storage.set(
			storageKey,
			containers.map( ( container ) => container.model.toJSON( { copyHtmlCache: true } ) )
		);
	}
}

export default Copy;
