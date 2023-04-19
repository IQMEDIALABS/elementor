import { Sources } from 'elementor-editor/editor-constants';

export class OpenDefault extends $e.modules.CommandInternalBase {
	apply( args = {} ) {
		$e.route( elementor.documents.getCurrent().config.panel.default_route, args, {
			source: Sources.PANEL,
		} );

		return Promise.resolve();
	}
}

export default OpenDefault;
