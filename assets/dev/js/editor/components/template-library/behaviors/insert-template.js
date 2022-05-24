import { SOURCES } from 'elementor-editor/editor-constants';

var InsertTemplateHandler;

InsertTemplateHandler = Marionette.Behavior.extend( {
	ui: {
		insertButton: '.elementor-template-library-template-insert',
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick',
	},

	onInsertButtonClick: function() {
		const args = {
				model: this.view.model,
			},
			meta = {
				source: SOURCES.TEMPLATE_LIBRARY,
			};

		if ( 'remote' === args.model.get( 'source' ) && ! elementor.config.library_connect.is_connected ) {
			$e.route( 'library/connect', args, meta );
			return;
		}

		$e.run( 'library/insert-template', args, meta );
	},
} );

module.exports = InsertTemplateHandler;
