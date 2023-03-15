import { Sources } from 'elementor-editor/editor-constants';

var InsertTemplateHandler;

InsertTemplateHandler = Marionette.Behavior.extend( {
	ui: {
		insertButton: '.elementor-template-library-template-insert',
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick',
	},

	onInsertButtonClick() {
		const args = {
				model: this.view.model,
			},
			meta = {
				source: Sources.TEMPLATE_LIBRARY,
			};

		this.ui.insertButton.addClass( 'elementor-disabled' );

		if ( 'remote' === args.model.get( 'source' ) && ! elementor.config.library_connect.is_connected ) {
			$e.route( 'library/connect', args, meta );
			return;
		}

		$e.run( 'library/insert-template', args, meta );
	},
} );

module.exports = InsertTemplateHandler;
