var ControlBaseView = require( 'elementor-views/controls/base' ),
	ControlStructureItemView;

ControlStructureItemView = ControlBaseView.extend( {
	ui: function() {
		var ui = ControlBaseView.prototype.ui.apply( this, arguments );

		ui.resetStructure = '.elementor-control-structure-reset';

		return ui;
	},

	childEvents: {
		'click @ui.resetStructure': 'onResetStructureClick'
	},

	templateHelpers: function() {
		var helpers = ControlBaseView.prototype.templateHelpers.apply( this, arguments );

		helpers.getMorePresets = _.bind( this.getMorePresets, this );

		return helpers;
	},

	getCurrentEditedSection: function() {
		var editor = elementor.getPanelView().getCurrentPageView();

		return editor.getOption( 'editedElementView' );
	},

	getMorePresets: function() {
		var parsedStructure = elementor.presetsFactory.getParsedStructure( this.getControlValue() );

		return elementor.presetsFactory.getPresets( parsedStructure.columnsCount );
	},

	onInputChange: function() {
		this.getCurrentEditedSection().redefineLayout();

		this.render();
	},

	onResetStructureClick: function() {
		this.getCurrentEditedSection().resetColumnsCustomSize();
	}
} );

module.exports = ControlStructureItemView;
