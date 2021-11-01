var ControlsStack = elementorModules.editor.views.ControlsStack,
	EditorView;

EditorView = ControlsStack.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-editor-content' ),

	id: 'elementor-panel-page-editor',

	childViewContainer: '#elementor-controls',

	childViewOptions: function() {
		return {
			element: this.getOption( 'editedElementView' ),
			container: this.getOption( 'editedElementView' ).getContainer(),
			// TODO: elementSettingsModel is deprecated since 2.8.0.
			elementSettingsModel: this.model.get( 'settings' ),

			elementEditSettings: this.model.get( 'editSettings' ),
		};
	},

	getNamespaceArray: function() {
		var eventNamespace = elementorModules.editor.views.ControlsStack.prototype.getNamespaceArray();

		const model = this.getOption( 'editedElementView' ).getEditModel(),
			currentElementType = model.get( 'elType' );

		// Element Type: section / column / widget.
		eventNamespace.push( currentElementType );

		if ( 'widget' === currentElementType ) {
			// Widget Type: heading / button and etc.
			eventNamespace.push( model.get( 'widgetType' ) );
		}

		return eventNamespace;
	},

	initialize: function() {
		ControlsStack.prototype.initialize.apply( this, arguments );

		const editSettings = this.model.get( 'editSettings' );

		if ( editSettings ) {
			const panelSettings = editSettings.get( 'panel' );

			if ( panelSettings ) {
				this.activeTab = panelSettings.activeTab;

				this.activeSection = panelSettings.activeSection;
			}
		}
	},

	activateSection: function() {
		ControlsStack.prototype.activateSection.apply( this, arguments );

		this.model.get( 'editSettings' ).set( 'panel', {
			activeTab: this.activeTab,
			activeSection: this.activeSection,
		} );

		return this;
	},

	openActiveSection: function() {
		ControlsStack.prototype.openActiveSection.apply( this, arguments );

		elementor.channels.editor.trigger( 'section:activated', this.activeSection, this );
	},

	isVisibleSectionControl: function( sectionControlModel ) {
		return ControlsStack.prototype.isVisibleSectionControl.apply( this, arguments ) && elementor.helpers.isActiveControl( sectionControlModel, this.model.get( 'settings' ).attributes );
	},

	scrollToEditedElement: function() {
		elementor.helpers.scrollToView( this.getOption( 'editedElementView' ).$el );
	},

	onDestroy: function() {
		this.model.trigger( 'editor:close' );

		this.triggerMethod( 'editor:destroy' );
	},

	onDeviceModeChange: function() {
		ControlsStack.prototype.onDeviceModeChange.apply( this, arguments );

		this.scrollToEditedElement();
	},

	onChildviewSettingsChange: function( childView ) {
		var editedElementView = this.getOption( 'editedElementView' ),
			editedElementType = editedElementView.model.get( 'elType' );

		if ( 'widget' === editedElementType ) {
			editedElementType = editedElementView.model.get( 'widgetType' );
		}

		elementor.channels.editor
			.trigger( 'change', childView, editedElementView )
			.trigger( 'change:' + editedElementType, childView, editedElementView )
			.trigger( 'change:' + editedElementType + ':' + childView.model.get( 'name' ), childView, editedElementView );
	},
} );

module.exports = EditorView;
