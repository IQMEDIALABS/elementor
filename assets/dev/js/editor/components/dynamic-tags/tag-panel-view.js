var TagControlsStack = require( 'elementor-dynamic-tags/tag-controls-stack' );

module.exports = Marionette.ItemView.extend( {

	className: 'elementor-dynamic-cover elementor-input-style',

	tagControlsStack: null,

	templateHelpers: function() {
		var helpers = {};
		if ( this.model ) {
			helpers.controls = this.model.options.controls;
		}

		return helpers;
	},

	ui: {
		remove: '.elementor-dynamic-cover__remove',
	},

	events: function() {
		var events = {
			'click @ui.remove': 'onRemoveClick',
		};

		if ( this.hasSettings() ) {
			events.click = 'onClick';
		}

		return events;
	},

	getTemplate: function() {
		var config = this.getTagConfig(),
			templateFunction = Marionette.TemplateCache.get( '#tmpl-elementor-control-dynamic-cover' ),
			renderedTemplate = Marionette.Renderer.render( templateFunction, {
				hasSettings: this.hasSettings(),
				isRemovable: ! this.getOption( 'dynamicSettings' ).default,
				title: config.title,
				content: config.panel_template,
			} );

		return Marionette.TemplateCache.prototype.compileTemplate( renderedTemplate.trim() );
	},

	getTagConfig: function() {
		return elementor.dynamicTags.getConfig( 'tags.' + this.getOption( 'name' ) );
	},

	initSettingsPopup: function() {
		var settingsPopupOptions = {
			className: 'elementor-tag-settings-popup',
			position: {
				my: 'left top+5',
				at: 'left bottom',
				of: this.$el,
				autoRefresh: true,
			},
		};

		var settingsPopup = elementorCommon.dialogsManager.createWidget( 'buttons', settingsPopupOptions );

		this.getSettingsPopup = function() {
			return settingsPopup;
		};
	},

	hasSettings: function() {
		return !! Object.values( this.getTagConfig().controls ).length;
	},

	showSettingsPopup: function() {
		if ( ! this.tagControlsStack ) {
			this.initTagControlsStack();
		}

		var settingsPopup = this.getSettingsPopup();

		if ( settingsPopup.isVisible() ) {
			return;
		}

		settingsPopup.show();
	},

	initTagControlsStack: function() {
		this.tagControlsStack = new TagControlsStack( {
			model: this.model,
			controls: this.model.controls,
			name: this.options.name,
			controlName: this.options.controlName,
			container: this.options.container,
			el: this.getSettingsPopup().getElements( 'message' )[ 0 ],
		} );

		this.tagControlsStack.render();
	},

	initModel: function() {
		this.model = new elementorModules.editor.elements.models.BaseSettings( this.getOption( 'settings' ), {
			controls: this.getTagConfig().controls,
		} );
	},

	initialize: function() {
		// The `model` should always be available.
		this.initModel();

		if ( ! this.hasSettings() ) {
			return;
		}

		this.initSettingsPopup();

		this.listenTo( this.model, 'change', this.render );
	},

	onClick: function() {
		this.showSettingsPopup();
	},

	onRemoveClick: function( event ) {
		event.stopPropagation();

		this.destroy();

		this.trigger( 'remove' );
	},

	onDestroy: function() {
		if ( this.hasSettings() ) {
			this.getSettingsPopup().destroy();
		}

		if ( this.tagControlsStack ) {
			this.tagControlsStack.destroy();
		}
	},
} );
