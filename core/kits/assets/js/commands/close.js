import CommandHookable from 'elementor-api/modules/command-hookable';

export class Close extends CommandHookable {
	apply( args ) {
		const { source = 'command' } = args;

		// The kit is opened directly.
		if ( elementor.config.initial_document.id === parseInt( elementor.config.kit_id ) ) {
			return $e.run( 'panel/global/exit' );
		}

		$e.internal( 'panel/state-loading' );

		elementor.enterPreviewMode( true );

		return new Promise( ( resolve ) => {
			setTimeout( () => {
				return $e.run( 'editor/documents/switch', {
					id: elementor.config.initial_document.id,
					onClose: ( document ) => {
						if ( document.isDraft() ) {
							// Restore published style.
							elementor.toggleDocumentCssFiles( document, true );
							elementor.settings.page.destroyControlsCSS();
						}
						$e.components.get( 'panel/global' ).close();
						$e.routes.clearHistory( this.component.getRootContainer() );
					},
					source,
				} )
				.finally( () => {
					resolve();

					$e.internal( 'panel/state-ready' );
				} )
				.catch( ( error ) => {
					console.log( error ); // eslint-disable-line
					elementor.exitPreviewMode();
				} );
			}, 500 );
		} );
	}
}

export default Close;
