import Component from './component';

var BaseSettings = require( 'elementor-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {
	getStyleId: function() {
		return this.getSettings( 'name' ) + '-' + elementor.documents.getCurrent().id;
	},

	onInit: function() {
		BaseSettings.prototype.onInit.apply( this );

		$e.components.register( new Component( { manager: this } ) );
	},

	save: function() {},

	getDataToSave: function( data ) {
		data.id = elementor.config.document.id;

		return data;
	},

	// Emulate an element view/model structure with the parts needed for a container.
	getEditedView() {
		if ( this.editedView ) {
			return this.editedView;
		}

		const documentElementType = elementor.getElementType( 'document' ),
			ModelClass = documentElementType.getModel(),
			id = this.getContainerId(),
			editModel = new ModelClass( {
				id,
				elType: id,
				settings: this.model,
				elements: elementor.elements,
			} ),
			container = new elementorModules.editor.Container( {
				type: id,
				id: editModel.id,
				model: editModel,
				settings: editModel.get( 'settings' ),
				label: elementor.config.document.panel.title,
				controls: this.model.controls,
				children: elementor.elements,
				parent: false,
				// Emulate a view that can render the style.
				renderer: {
					view: {
						lookup: () => container,
						renderOnChange: () => this.updateStylesheet(),
						renderUI: () => this.updateStylesheet(),
					},
				},
			} );

		this.editedView = {
			getContainer: () => container,
			getEditModel: () => editModel,
			model: editModel,
		};

		return this.editedView;
	},

	getContainerId() {
		return 'document';
	},
} );
