import environment from 'elementor-common/utils/environment';

var ControlsCSSParser = require( 'elementor-editor-utils/controls-css-parser' ),
	Validator = require( 'elementor-validator/base' ),
	BaseContainer = require( 'elementor-views/base-container' ),
	BaseElementView;

/**
 * @typedef {{}} DataBinding
 * @property {DOMStringMap} dataset
 * @property {HTMLElement} el
 */

/**
 * @name BaseElementView
 * @extends {BaseContainer}
 */
BaseElementView = BaseContainer.extend( {
	tagName: 'div',

	controlsCSSParser: null,

	allowRender: true,

	toggleEditTools: false,

	renderAttributes: {},

	className() {
		let classes = 'elementor-element elementor-element-edit-mode ' + this.getElementUniqueID();

		if ( this.toggleEditTools ) {
			classes += ' elementor-element--toggle-edit-tools';
		}

		return classes;
	},

	attributes() {
		return {
			'data-id': this.getID(),
			'data-element_type': this.model.get( 'elType' ),
		};
	},

	ui() {
		return {
			tools: '> .elementor-element-overlay > .elementor-editor-element-settings',
			editButton: '> .elementor-element-overlay .elementor-editor-element-edit',
			duplicateButton: '> .elementor-element-overlay .elementor-editor-element-duplicate',
			addButton: '> .elementor-element-overlay .elementor-editor-element-add',
			removeButton: '> .elementor-element-overlay .elementor-editor-element-remove',
		};
	},

	behaviors() {
		const elementType = this.options.model.get( 'elType' );

		const groups = elementor.hooks.applyFilters( `elements/${ elementType }/contextMenuGroups`, this.getContextMenuGroups(), this );

		const behaviors = {
			contextMenu: {
				behaviorClass: require( 'elementor-behaviors/context-menu' ),
				groups: groups,
			},
		};

		return elementor.hooks.applyFilters( 'elements/base/behaviors', behaviors, this );
	},

	getBehavior( name ) {
		return this._behaviors[ Object.keys( this.behaviors() ).indexOf( name ) ];
	},

	events() {
		return {
			mousedown: 'onMouseDown',
			'click @ui.editButton': 'onEditButtonClick',
			'click @ui.duplicateButton': 'onDuplicateButtonClick',
			'click @ui.addButton': 'onAddButtonClick',
			'click @ui.removeButton': 'onRemoveButtonClick',
		};
	},

	getElementType() {
		return this.model.get( 'elType' );
	},

	getIDInt() {
		return parseInt( this.getID(), 16 );
	},

	getChildType() {
		return elementor.helpers.getElementChildType( this.getElementType() );
	},

	getChildView( model ) {
		const elementType = elementor.getElementType( model.get( 'elType' ), model.get( 'widgetType' ) );

		if ( ! elementType ) {
			throw new Error( 'Element type not found: ' + model.get( 'elType' ) );
		}

		return elementor.hooks.applyFilters( 'element/view', elementType.getView(), model, this );
	},

	getTemplateType() {
		return 'js';
	},

	getEditModel() {
		return this.model;
	},

	getContainer() {
		if ( ! this.container ) {
			const settingsModel = this.model.get( 'settings' );

			this.container = new elementorModules.editor.Container( {
				type: this.model.get( 'elType' ),
				id: this.model.id,
				model: this.model,
				settings: settingsModel,
				view: this,
				parent: this._parent ? this._parent.getContainer() : {},
				label: elementor.helpers.getModelLabel( this.model ),
				controls: settingsModel.options.controls,
			} );

			// Since initial 'getContainer()' called in defer, anyone who requires a container can be depended on this trigger.
			this.container.view.triggerMethod( 'container:created' );
		}
		return this.container;
	},

	getContextMenuGroups() {
		const controlSign = environment.mac ? '⌘' : '^';

		let groups = [
			{
				name: 'general',
				actions: [
					{
						name: 'edit',
						icon: 'eicon-edit',
						/* translators: %s: Element Name. */
						title: () => sprintf( __( 'Edit %s', 'elementor' ), elementor.selection.isMultiple() ? '' : this.options.model.getTitle() ),
						isEnabled: () => ! elementor.selection.isMultiple(),
						callback: () => $e.run( 'panel/editor/open', {
							model: this.options.model, // Todo: remove on merge router
							view: this, // Todo: remove on merge router
							container: this.getContainer(),
						} ),
					}, {
						name: 'duplicate',
						icon: 'eicon-clone',
						title: __( 'Duplicate', 'elementor' ),
						shortcut: controlSign + '+D',
						isEnabled: () => elementor.selection.isSameType(),
						callback: () => $e.run( 'document/elements/duplicate', { containers: elementor.selection.getElements( this.getContainer() ) } ),
					},
				],
			}, {
				name: 'clipboard',
				actions: [
					{
						name: 'copy',
						title: __( 'Copy', 'elementor' ),
						shortcut: controlSign + '+C',
						isEnabled: () => elementor.selection.isSameType(),
						callback: () => $e.run( 'document/elements/copy', { containers: elementor.selection.getElements( this.getContainer() ) } ),
					}, {
						name: 'paste',
						title: __( 'Paste', 'elementor' ),
						shortcut: controlSign + '+V',
						isEnabled: () => $e.components.get( 'document/elements' ).utils.isPasteEnabled( this.getContainer() ) &&
							elementor.selection.isSameType(),
						callback: () => $e.run( 'document/ui/paste', {
							container: this.getContainer(),
						} ),
					}, {
						name: 'pasteStyle',
						title: __( 'Paste Style', 'elementor' ),
						shortcut: controlSign + '+⇧+V',
						isEnabled: () => !! elementorCommon.storage.get( 'clipboard' ),
						callback: () => $e.run( 'document/elements/paste-style', { containers: elementor.selection.getElements( this.getContainer() ) } ),
					}, {
						name: 'resetStyle',
						title: __( 'Reset Style', 'elementor' ),
						callback: () => $e.run( 'document/elements/reset-style', { containers: elementor.selection.getElements( this.getContainer() ) } ),
					},
				],
			},
		];

		let customGroups = [];

		/**
		 * Filter Additional Context Menu Groups.
		 *
		 * This filter allows adding new context menu groups to elements.
		 *
		 * @param array customGroups - An array of group objects.
		 * @param string elementType - The current element type.
		 */
		customGroups = elementor.hooks.applyFilters( 'elements/context-menu/groups', customGroups, this.options.model.get( 'elType' ) );

		if ( customGroups.length ) {
			groups = [ ...groups, ...customGroups ];
		}

		groups.push( {
			name: 'delete',
			actions: [
				{
					name: 'delete',
					icon: 'eicon-trash',
					title: () => elementor.selection.isMultiple() ?
							sprintf( __( 'Delete %d items', 'elementor' ), elementor.selection.getElements().length ) :
							__( 'Delete', 'elementor' ),
					shortcut: '⌦',
					callback: () => $e.run( 'document/elements/delete', { containers: elementor.selection.getElements( this.getContainer() ) } ),
				},
			],
		} );

		return groups;
	},

	getEditButtons: function() {
		return {};
	},

	initialize() {
		BaseContainer.prototype.initialize.apply( this, arguments );

		const editModel = this.getEditModel();

		if ( this.collection && this.onCollectionChanged ) {
			elementorCommon.helpers.softDeprecated( 'onCollectionChanged', '2.8.0', '$e.hooks' );
			this.listenTo( this.collection, 'add remove reset', this.onCollectionChanged, this );
		}

		if ( this.onSettingsChanged ) {
			elementorCommon.helpers.softDeprecated( 'onSettingsChanged', '2.8.0', '$e.hooks' );
			this.listenTo( editModel.get( 'settings' ), 'change', this.onSettingsChanged );
		}

		this.listenTo( editModel.get( 'editSettings' ), 'change', this.onEditSettingsChanged )
			.listenTo( this.model, 'request:edit', this.onEditRequest )
			.listenTo( this.model, 'request:toggleVisibility', this.toggleVisibility );

		this.initControlsCSSParser();

		_.defer( () => {
			// Init container. Defer - in order to init the container after the element is fully initialized, and properties like `_parent` are available.
			this.getContainer();
		} );
	},

	getHandlesOverlay: function() {
		const elementType = this.getElementType(),
			$handlesOverlay = jQuery( '<div>', { class: 'elementor-element-overlay' } ),
			$overlayList = jQuery( '<ul>', { class: `elementor-editor-element-settings elementor-editor-${ elementType }-settings` } ),
			editButtonsEnabled = elementor.getPreferences( 'edit_buttons' ),
			elementData = elementor.getElementData( this.model );

		let editButtons = this.getEditButtons();

		// We should only allow external modification to edit buttons if the user enabled edit buttons.
		if ( editButtonsEnabled ) {
			/**
			 * Filter edit buttons.
			 *
			 * This filter allows adding edit buttons to all element types.
			 *
			 * @since 3.5.0
			 *
			 * @param array editButtons An array of buttons.
			 */
			editButtons = elementor.hooks.applyFilters( `elements/edit-buttons`, editButtons );

			/**
			 * Filter edit buttons.
			 *
			 * This filter allows adding edit buttons only to a specific element type.
			 *
			 * The dynamic portion of the hook name, `elementType`, refers to element type (widget, column, section).
			 *
			 * @since 3.5.0
			 *
			 * @param array editButtons An array of buttons.
			 */
			editButtons = elementor.hooks.applyFilters( `elements/edit-buttons/${ elementType }`, editButtons );
		}

		// Only sections always have the remove button, even if the Editing Handles preference is off.
		if ( 'section' === elementType || editButtonsEnabled ) {
			editButtons.remove = {
				/* translators: %s: Element Name. */
				title: sprintf( __( 'Delete %s', 'elementor' ), elementData.title ),
				icon: 'close',
			};
		}

		jQuery.each( editButtons, ( toolName, tool ) => {
			const $item = jQuery( '<li>', { class: `elementor-editor-element-setting elementor-editor-element-${ toolName }`, title: tool.title } ),
				$icon = jQuery( '<i>', { class: `eicon-${ tool.icon }`, 'aria-hidden': true } ),
				$a11y = jQuery( '<span>', { class: 'elementor-screen-only' } );

			$a11y.text( tool.title );

			$item.append( $icon, $a11y );

			$overlayList.append( $item );
		} );

		$handlesOverlay.append( $overlayList );

		return $handlesOverlay;
	},

	attachElContent: function( html ) {
		this.$el.empty().append( this.getHandlesOverlay(), html );
	},

	startTransport() {
		elementorCommon.helpers.softDeprecated( 'element.startTransport', '2.8.0', "$e.run( 'document/elements/copy' )" );

		$e.run( 'document/elements/copy', {
			container: this.getContainer(),
		} );
	},

	copy() {
		elementorCommon.helpers.softDeprecated( 'element.copy', '2.8.0', "$e.run( 'document/elements/copy' )" );

		$e.run( 'document/elements/copy', {
			container: this.getContainer(),
		} );
	},

	cut() {
		elementorCommon.helpers.softDeprecated( 'element.cut', '2.8.0' );
	},

	paste() {
		elementorCommon.helpers.softDeprecated( 'element.paste', '2.8.0', "$e.run( 'document/elements/paste' )" );

		$e.run( 'document/elements/paste', {
			container: this.getContainer(),
			at: this._parent.collection.indexOf( this.model ),
		} );
	},

	duplicate() {
		elementorCommon.helpers.softDeprecated( 'element.duplicate', '2.8.0', "$e.run( 'document/elements/duplicate' )" );

		$e.run( 'document/elements/duplicate', {
			container: this.getContainer(),
		} );
	},

	pasteStyle() {
		elementorCommon.helpers.softDeprecated( 'element.pasteStyle', '2.8.0', "$e.run( 'document/elements/paste-style' )" );

		$e.run( 'document/elements/paste-style', {
			container: this.getContainer(),
		} );
	},

	resetStyle() {
		elementorCommon.helpers.softDeprecated( 'element.resetStyle', '2.8.0', "$e.run( 'document/elements/reset-style' )" );

		$e.run( 'document/elements/reset-style', {
			container: this.getContainer(),
		} );
	},

	isStyleTransferControl( control ) {
		if ( undefined !== control.style_transfer ) {
			return control.style_transfer;
		}

		return 'content' !== control.tab || control.selectors || control.prefix_class;
	},

	toggleVisibility() {
		this.model.set( 'hidden', ! this.model.get( 'hidden' ) );

		this.toggleVisibilityClass();
	},

	toggleVisibilityClass() {
		this.$el.toggleClass( 'elementor-edit-hidden', ! ! this.model.get( 'hidden' ) );
	},

	addElementFromPanel( options ) {
		options = options || {};

		const elementView = elementor.channels.panelElements.request( 'element:selected' ),
			model = {
				elType: elementView.model.get( 'elType' ),
			};

		if ( elementor.helpers.maybeDisableWidget() ) {
			return;
		}

		if ( 'widget' === model.elType ) {
			model.widgetType = elementView.model.get( 'widgetType' );
		} else if ( 'section' === model.elType ) {
			model.isInner = true;
		} else if ( 'container' !== model.elType ) {
			// Don't allow adding anything other than widget, inner-section or a container.
			return;
		}

		const customData = elementView.model.get( 'custom' );

		if ( customData ) {
			jQuery.extend( model, customData );
		}

		// Reset the selected element cache.
		elementor.channels.panelElements.reply( 'element:selected', null );

		return $e.run( 'document/elements/create', {
			container: this.getContainer(),
			model,
			options,
		} );
	},

	// TODO: Unused function.
	addControlValidator( controlName, validationCallback ) {
		validationCallback = validationCallback.bind( this );

		const validator = new Validator( { customValidationMethod: validationCallback } ),
			validators = this.getEditModel().get( 'settings' ).validators;

		if ( ! validators[ controlName ] ) {
			validators[ controlName ] = [];
		}

		validators[ controlName ].push( validator );
	},

	addRenderAttribute( element, key, value, overwrite ) {
		const self = this;

		if ( 'object' === typeof element ) {
			jQuery.each( element, ( elementKey, elementValue ) => {
				self.addRenderAttribute( elementKey, elementValue, null, overwrite );
			} );

			return self;
		}

		if ( 'object' === typeof key ) {
			jQuery.each( key, ( attributeKey, attributeValue ) => {
				self.addRenderAttribute( element, attributeKey, attributeValue, overwrite );
			} );

			return self;
		}

		if ( ! self.renderAttributes[ element ] ) {
			self.renderAttributes[ element ] = {};
		}

		if ( ! self.renderAttributes[ element ][ key ] ) {
			self.renderAttributes[ element ][ key ] = [];
		}

		if ( ! Array.isArray( value ) ) {
			value = [ value ];
		}

		if ( overwrite ) {
			self.renderAttributes[ element ][ key ] = value;
		} else {
			self.renderAttributes[ element ][ key ] = self.renderAttributes[ element ][ key ].concat( value );
		}
	},

	getRenderAttributeString( element ) {
		if ( ! this.renderAttributes[ element ] ) {
			return '';
		}

		const renderAttributes = this.renderAttributes[ element ],
			attributes = [];

		jQuery.each( renderAttributes, ( attributeKey, attributeValue ) => {
			attributes.push( attributeKey + '="' + _.escape( attributeValue.join( ' ' ) ) + '"' );
		} );

		return attributes.join( ' ' );
	},

	isInner: function() {
		return !! this.model.get( 'isInner' );
	},

	initControlsCSSParser() {
		this.controlsCSSParser = new ControlsCSSParser( {
			id: this.model.get( 'id' ),
			context: this,
			settingsModel: this.getEditModel().get( 'settings' ),
			dynamicParsing: this.getDynamicParsingSettings(),
		} );
	},

	enqueueFonts() {
		const editModel = this.getEditModel(),
			settings = editModel.get( 'settings' );

		// Enqueue Icon Fonts
		jQuery.each( settings.getIconsControls(), ( index, control ) => {
			const iconType = editModel.getSetting( control.name );

			if ( ! iconType || ! iconType.library ) {
				return;
			}

			elementor.helpers.enqueueIconFonts( iconType.library );
		} );
	},

	renderStyles( settings ) {
		if ( ! settings ) {
			settings = this.getEditModel().get( 'settings' );
		}

		this.controlsCSSParser.stylesheet.empty();

		this.controlsCSSParser.addStyleRules(
			settings.getStyleControls(),
			settings.attributes,
			this.getEditModel().get( 'settings' ).controls,
			[ /{{ID}}/g, /{{WRAPPER}}/g ],
			[ this.getID(), '.elementor-' + elementor.config.document.id + ' .elementor-element.' + this.getElementUniqueID() ] );

		this.controlsCSSParser.addStyleToDocument();
	},

	renderCustomClasses() {
		const self = this;

		const settings = self.getEditModel().get( 'settings' ),
			classControls = settings.getClassControls();

		// Remove all previous classes
		_.each( classControls, ( control ) => {
			let previousClassValue = settings.previous( control.name );

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ previousClassValue ] ) {
					previousClassValue = control.classes_dictionary[ previousClassValue ];
				}
			}

			self.$el.removeClass( control.prefix_class + previousClassValue );
		} );

		// Add new classes
		_.each( classControls, ( control ) => {
			const value = settings.attributes[ control.name ];
			let classValue = value;

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ value ] ) {
					classValue = control.classes_dictionary[ value ];
				}
			}

			const isVisible = elementor.helpers.isActiveControl( control, settings.attributes );

			if ( isVisible && ( classValue || 0 === classValue ) ) {
				self.$el.addClass( control.prefix_class + classValue );
			}
		} );

		self.$el.addClass( _.result( self, 'className' ) );

		self.toggleVisibilityClass();
	},

	renderCustomElementID() {
		const customElementID = this.getEditModel().get( 'settings' ).get( '_element_id' );

		this.$el.attr( 'id', customElementID );
	},

	renderUI: function() {
		this.renderCustomClasses();
		this.renderCustomElementID();
		this.enqueueFonts();

		_.defer( () => {
			// Defer the styles render to make sure that the global colors are ready.
			this.renderStyles();
		} );
	},

	runReadyTrigger: function() {
		const self = this;

		_.defer( function() {
			elementorFrontend.elementsHandler.runReadyTrigger( self.el );

			if ( ! elementorFrontend.isEditMode() ) {
				return;
			}

			// In edit mode - handle an external elements that loaded by another elements like shortcode etc.
			self.$el.find( '.elementor-element.elementor-' + self.model.get( 'elType' ) + ':not(.elementor-element-edit-mode)' ).each( function() {
				elementorFrontend.elementsHandler.runReadyTrigger( this );
			} );
		} );
	},

	getID() {
		return this.model.get( 'id' );
	},

	getElementUniqueID() {
		return 'elementor-element-' + this.getID();
	},

	renderHTML: function() {
		const templateType = this.getTemplateType(),
			editModel = this.getEditModel();

		if ( 'js' === templateType ) {
			this.getEditModel().setHtmlCache();
			this.render();
			editModel.renderOnLeave = true;
		} else {
			editModel.renderRemoteServer();
		}
	},

	renderChanges( settings, shouldRenderUI = true ) {
		// Make sure is correct model
		if ( settings instanceof elementorModules.editor.elements.models.BaseSettings ) {
			const hasChanged = settings.hasChanged();
			let isContentChanged = ! hasChanged,
				isRenderRequired = ! hasChanged;

			_.each( settings.changedAttributes(), ( settingValue, settingKey ) => {
				const control = settings.getControl( settingKey );

				if ( '_column_size' === settingKey ) {
					isRenderRequired = true;
					return;
				}

				if ( ! control ) {
					isRenderRequired = true;
					isContentChanged = true;
					return;
				}

				if ( 'none' !== control.render_type ) {
					isRenderRequired = true;
				}

				if ( -1 !== [ 'none', 'ui' ].indexOf( control.render_type ) ) {
					return;
				}

				if ( 'template' === control.render_type || ( ! settings.isStyleControl( settingKey ) && ! settings.isClassControl( settingKey ) && '_element_id' !== settingKey ) ) {
					isContentChanged = true;
				}
			} );

			if ( ! isRenderRequired ) {
				return;
			}

			if ( shouldRenderUI && ! isContentChanged ) {
				this.renderUI();

				return;
			}
		}

		this.renderHTML();
	},

	/**
	 * Function linkDataBindings().
	 *
	 * Link data to allow partial render, instead of full re-render
	 *
	 * How to use?
	 *  If the element which should be rendered for a setting key is known in advance, it's possible to add the following attributes to the element to avoid full re-render:
	 *  Example for repeater item:
	 * 'data-binding-type': 'repeater-item',               // Type of binding (to know how to behave).
	 * 'data-binding-setting': 'tab_title',                // Setting key that effect the binding.
	 * 'data-binding-index': tabCount,                     // Index is required for repeater items.
	 *
	 * Example for content:
	 * 'data-binding-type': 'content',                     // Type of binding.
	 * 'data-binding-setting': 'testimonial_content',      // Setting change to capture, the value will replace the link.
	 *
	 * By adding the following example attributes inside the widget the element innerHTML will be linked to the 'testimonial_content' setting value.
	 *
	 * Current Limitation:
	 * Not working with dynamics, will required full re-render.
	 */
	linkDataBindings() {
		/**
		 * @type {Array.<DataBinding>}
		 */
		this.dataBindings = [];

		const id = this.$el.data( 'id' );

		if ( ! id ) {
			return;
		}

		const $dataBinding = this.$el.find( '[data-binding-type]' );

		if ( ! $dataBinding.length ) {
			return;
		}

		const self = this;

		$dataBinding.filter( function() {
			const $current = jQuery( this );

			// To support nested data-binding bypass nested data-binding that are not part of the current.
			if ( $current.closest( '.elementor-element' ).data( 'id' ) === id ) {
				if ( this.dataset.bindingType ) {
					self.dataBindings.push( {
						el: this,
						dataset: this.dataset,
					} );
				}
			}
		} );
	},

	/**
	 * Function renderDataBindings().
	 *
	 * Render linked data.
	 *
	 * @param {Object} settings
	 * @param {Array.<DataBinding>} dataBindings
	 *
	 * @returns {boolean} - false on fail.
	 */
	renderDataBindings( settings, dataBindings ) {
		if ( ! this.dataBindings?.length ) {
			return false;
		}

		let changed = false;

		for ( const dataBinding of dataBindings ) {
			switch ( dataBinding.dataset.bindingType ) {
				case 'repeater-item': {
					const repeater = this.container.repeaters[ dataBinding.dataset.bindingRepeaterName ];

					if ( ! repeater ) {
						break;
					}

					const container = repeater.children.find( ( i ) => i.id === settings.attributes._id );

					if ( ( container?.parent?.children.indexOf( container ) + 1 ) === parseInt( dataBinding.dataset.bindingIndex ) ) {
						const change = settings.changed[ dataBinding.dataset.bindingSetting ];

						if ( change !== undefined ) {
							changed = true;
							dataBinding.el.innerHTML = change;
						}
					}
				}
				break;

				case 'content': {
					if ( undefined !== settings.changed[ dataBinding.dataset.bindingSetting ] ) {
						const change = settings.changed[ dataBinding.dataset.bindingSetting ];

						changed = true;
						dataBinding.el.innerHTML = change;
					}
				}
				break;
			}

			if ( changed ) {
				break;
			}
		}

		return changed;
	},

	/**
	 * Function renderOnChange().
	 *
	 * Render the changes in the settings according to the current situation.
	 *
	 * @param {Object} settings
	 */
	renderOnChange( settings ) {
		if ( ! this.allowRender ) {
			return;
		}

		// If not a dynamic change, and renderDataBindings() was successful, then it was rendered.
		if ( ! settings.__dynamic__ && this.renderDataBindings( settings, this.dataBindings ) ) {
			return;
		}

		this.renderChanges( settings );
	},

	getDynamicParsingSettings() {
		const self = this;

		return {
			onServerRequestStart() {
				self.$el.addClass( 'elementor-loading' );
			},
			onServerRequestEnd() {
				self.render();

				self.$el.removeClass( 'elementor-loading' );
			},
		};
	},

	serializeData() {
		const data = BaseContainer.prototype.serializeData.apply( this, arguments );

		data.settings = this.getEditModel().get( 'settings' ).parseDynamicSettings( data.settings, this.getDynamicParsingSettings() );

		return data;
	},

	save() {
		$e.route( 'library/save-template', {
			model: this.model,
		} );
	},

	onBeforeRender() {
		this.renderAttributes = {};
	},

	onRender() {
		this.linkDataBindings();

		this.renderUI();

		this.runReadyTrigger();

		if ( this.toggleEditTools ) {
			const editButton = this.ui.editButton;

			// Since this.ui.tools does not exist while testing.
			if ( this.ui.tools ) {
				this.ui.tools.hoverIntent( function() {
					editButton.addClass( 'elementor-active' );
				}, function() {
					editButton.removeClass( 'elementor-active' );
				}, { timeout: 500 } );
			}
		}

		// Defer to wait for all of the children to render.
		setTimeout( () => this.initDraggable(), 0 );
	},

	onEditSettingsChanged( changedModel ) {
		elementor.channels.editor.trigger( 'change:editSettings', changedModel, this );
	},

	onEditButtonClick( event ) {
		this.model.trigger( 'request:edit', { append: event.ctrlKey || event.metaKey } );
	},

	onEditRequest( options = {} ) {
		if ( ! this.container.isEditable() ) {
			return;
		}

		const model = this.getEditModel(),
			panel = elementor.getPanelView();

		if ( $e.routes.isPartOf( 'panel/editor' ) && panel.getCurrentPageView().model === model ) {
			return;
		}

		if ( options.scrollIntoView ) {
			elementor.helpers.scrollToView( this.$el, 200 );
		}

		$e.run( 'document/elements/toggle-selection', {
			container: this.getContainer(),
			append: options.append,
		} );
	},

	/**
	 * Select current element.
	 */
	select() {
		this.$el.addClass( 'elementor-element-editable' );
	},

	/**
	 * Deselect current element.
	 */
	deselect() {
		this.$el.removeClass( 'elementor-element-editable' );
	},

	onDuplicateButtonClick( event ) {
		event.stopPropagation();

		$e.run( 'document/elements/duplicate', { container: this.getContainer() } );
	},

	onRemoveButtonClick( event ) {
		event.stopPropagation();

		$e.run( 'document/elements/delete', { container: this.getContainer() } );
	},

	/* jQuery ui sortable preventing any `mousedown` event above any element, and as a result is preventing the `blur`
	 * event on the currently active element. Therefor, we need to blur the active element manually.
	 */
	onMouseDown( event ) {
		if ( jQuery( event.target ).closest( '.elementor-inline-editing' ).length ) {
			return;
		}

		elementorFrontend.elements.window.document.activeElement.blur();
	},

	onDestroy() {
		if ( this.dataBindings ) {
			delete this.dataBindings;
		}

		this.controlsCSSParser.removeStyleFromDocument();

		this.getEditModel().get( 'settings' ).validators = {};

		elementor.channels.data.trigger( 'element:destroy', this.model );
	},

	/**
	 * On `$el` drag start event.
	 * Used inside `Draggable` and can be overridden by the extending views.
	 *
	 * @return void
	 */
	onDragStart() {
		// TODO: Override if needed.
	},

	/**
	 * On `$el` drag end event.
	 * Used inside `Draggable` and can be overridden by the extending views.
	 *
	 * @return void
	 */
	onDragEnd() {
		// TODO: Override if needed.
	},

	/**
	 * Create a drag helper element.
	 * Copied from `behaviors/sortable.js` with some refactor.
	 *
	 * @return {HTMLDivElement}
	 */
	getDraggableHelper: function() {
		const model = this.getEditModel();

		const helper = document.createElement( 'div' );
		helper.classList.add( 'elementor-sortable-helper', `elementor-sortable-helper-${ model.get( 'elType' ) }` );

		helper.innerHTML = `
			<div class="icon">
				<i class="${ model.getIcon() }"></i>
			</div>
			<div class="elementor-element-title-wrapper">
				<div class="title">${ model.getTitle() }</div>
			</div>
		`;

		return helper;
	},

	/**
	 * Initialize the Droppable instance.
	 *
	 * @return void
	 */
	initDraggable: function() {
		// Init the draggable only for Containers and their children.
		if ( ! this.$el.hasClass( '.e-container' ) && ! this.$el.parents( '.e-container' ).length ) {
			return;
		}

		this.$el.html5Draggable( {
			onDragStart: ( e ) => {
				e.stopPropagation();

				const helper = this.getDraggableHelper();
				this.$el[ 0 ].appendChild( helper );

				// Set the x & y coordinates of the helper the same as the legacy jQuery sortable.
				e.originalEvent.dataTransfer.setDragImage( helper, 25, 20 );

				// Remove the helper element as soon as it's set as a drag image, since the element must be
				// rendered for at least a fraction of a second in order to set it as a drag image.
				setTimeout( () => {
					helper.remove();
				} );

				this.onDragStart( e );

				const container = this.getContainer();

				elementor.channels.editor.reply( 'element:dragged', container.view );
			},
			onDragEnd: ( e ) => {
				e.stopPropagation();

				this.onDragEnd( e );
			},

			groups: [ 'elementor-element' ],
		} );
	},
} );

module.exports = BaseElementView;
