import CommandHookable from 'elementor-api/modules/command-hookable';

export class Open extends CommandHookable {
	apply() {
		const kit = elementor.documents.get( elementor.config.kit_id );

		if ( kit && 'open' === kit.editor.status ) {
			$e.route( 'panel/global/style' );
			return jQuery.Deferred().resolve();
		}

		$e.routes.clearHistory( this.component.getRootContainer() );

		this.component.toggleHistoryClass();

		elementor.enterPreviewMode( true );

		return new Promise( ( resolve ) => {
			setTimeout( () => {
				elementor.exitPreviewMode();

				$e.internal( 'panel/state-loading' );

				$e.run( 'editor/documents/switch', {
					id: elementor.config.kit_id,
					mode: 'autosave',
				} ).finally( () => {
					resolve();

					$e.internal( 'panel/state-ready' );
				} );
			}, 500 );
		} );
	}
}

export default Open;
