// Most of the code has been copied from `section.js`.
import AddSectionView from 'elementor-views/add-section/inline';
import WidgetResizable from './behaviors/widget-resizeable';
import { DIRECTION_COLUMN, DIRECTION_ROW } from 'elementor-document/ui-states/direction-mode';

const BaseElementView = require( 'elementor-elements/views/base' ),
	ColumnEmptyView = require( 'elementor-elements/views/column-empty' );

const ContainerView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-elementor-container-content' ),

	emptyView: ColumnEmptyView,

	// Child view is empty in order to use the parent element.
	childViewContainer: '',

	className: function() {
		return `${ BaseElementView.prototype.className.apply( this ) } e-container`;
	},

	tagName: function() {
		return this.model.getSetting( 'html_tag' ) || 'div';
	},

	getCurrentUiStates() {
		return {
			directionMode: this.container.settings.get( 'flex_direction' ).includes( 'column' ) ? DIRECTION_COLUMN : DIRECTION_ROW,
		};
	},

	getFloatingBarConfig() {
		return {
			position: {
				// TODO: For future use.
				left: 0,
				bottom: 0,
			},
			defaultGroup: 'container',
			groups: {
				container: {
					title: __( 'Container', 'elementor' ),
					icon: 'eicons-container', // TODO: For future use.
					settings: {
						flex_direction: '',
						flex_align_items: '',
						flex_justify_content: '',
						flex_wrap: '',
					},
				},
			},
		};
	},

	behaviors: function() {
		const behaviors = BaseElementView.prototype.behaviors.apply( this, arguments );

		_.extend( behaviors, {
			Sortable: {
				behaviorClass: require( 'elementor-behaviors/sortable' ),
				elChildType: 'widget',
			},
			Resizable: {
				behaviorClass: WidgetResizable,
			},
		} );

		return elementor.hooks.applyFilters( 'elements/container/behaviors', behaviors, this );
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.model.get( 'editSettings' ).set( 'defaultEditRoute', 'layout' );

		// Hide the Floating Bar when exiting element edit mode.
		this.model.on( 'editor:close', () => {
			if ( this.setFloatingBarVisible ) {
				this.setFloatingBarVisible( false );
			}
		} );
	},

	getSortableOptions: function() {
		return {
			connectWith: '.e-container, .elementor-widget-wrap',
			items: '> .elementor-element',
			tolerance: 'pointer',
			swappable: true,
		};
	},

	changeContainerClasses: function() {
		const emptyClass = 'e-element-empty',
			populatedClass = 'e-element-populated',
			state = this.collection.isEmpty();

		this.$el.toggleClass( populatedClass, ! state )
			.toggleClass( emptyClass, state );
	},

	/**
	 * Save container as a template.
	 *
	 * @returns {void}
	 */
	saveAsTemplate() {
		$e.route( 'library/save-template', {
			model: this.model,
		} );
	},

	/**
	 * Add a `Save as Template` button to the context menu.
	 *
	 * @return {object}
	 *
	 */
	getContextMenuGroups: function() {
		var groups = BaseElementView.prototype.getContextMenuGroups.apply( this, arguments ),
			transferGroupIndex = groups.indexOf( _.findWhere( groups, { name: 'clipboard' } ) );

		groups.splice( transferGroupIndex + 1, 0, {
			name: 'save',
			actions: [
				{
					name: 'save',
					title: __( 'Save as Template', 'elementor' ),
					callback: this.saveAsTemplate.bind( this ),
				},
			],
		} );

		return groups;
	},

	isDroppingAllowed: function() {
		// Don't allow dragging items to document which is not editable.
		if ( ! this.getContainer().isEditable() ) {
			return false;
		}

		const elementView = elementor.channels.panelElements.request( 'element:selected' );

		if ( ! elementView ) {
			return false;
		}

		return [ 'widget', 'container' ].includes( elementView.model.get( 'elType' ) );
	},

	/**
	 * Determine if the current container is a nested container.
	 *
	 * @returns {boolean}
	 */
	isNested: function() {
		return 'document' !== this.getContainer().parent.model.get( 'elType' );
	},

	getEditButtons: function() {
		const elementData = elementor.getElementData( this.model ),
			editTools = {};

		editTools.add = {
			/* translators: %s: Element Name. */
			title: sprintf( __( 'Add %s', 'elementor' ), elementData.title ),
			icon: 'plus',
		};

		editTools.edit = {
			/* translators: %s: Element Name. */
			title: sprintf( __( 'Edit %s', 'elementor' ), elementData.title ),
			icon: 'handle',
		};

		if ( elementor.getPreferences( 'edit_buttons' ) ) {
			editTools.duplicate = {
				/* translators: %s: Element Name. */
				title: sprintf( __( 'Duplicate %s', 'elementor' ), elementData.title ),
				icon: 'clone',
			};
		}

		editTools.remove = {
			/* translators: %s: Element Name. */
			title: sprintf( __( 'Delete %s', 'elementor' ), elementData.title ),
			icon: 'close',
		};

		return editTools;
	},

	/**
	 * Toggle the `New Section` view when clicking the `add` button in the edit tools.
	 *
	 * @returns {void}
	 *
	 */
	onAddButtonClick: function() {
		if ( this.addSectionView && ! this.addSectionView.isDestroyed ) {
			this.addSectionView.fadeToDeath();

			return;
		}

		const addSectionView = new AddSectionView( {
			at: this.model.collection.indexOf( this.model ),
		} );

		addSectionView.render();

		this.$el.before( addSectionView.$el );

		addSectionView.$el.hide();

		// Delaying the slide down for slow-render browsers (such as FF)
		setTimeout( function() {
			addSectionView.$el.slideDown( null, function() {
				// Remove inline style, for preview mode.
				jQuery( this ).css( 'display', '' );
			} );
		} );

		this.addSectionView = addSectionView;
	},

	onRender: function() {
		BaseElementView.prototype.onRender.apply( this, arguments );

		// Show the floating bar if the current element is in edit mode.
		// TODO: Find out why the element is being rendered when setting a control value to its current value.
		if ( this.model.get( 'id' ) === elementor.getCurrentElement()?.model?.get( 'id' ) ) {
			setTimeout( () => {
				// TODO: Wait for the handler to initialize the Floating Bar when creating a new Container
				//  so the `setFloatingBarVisible` will be available for the view.
				if ( this.setFloatingBarVisible ) {
					this.setFloatingBarVisible( true );
				}
			}, 10 );
		}

		this.changeContainerClasses();

		// Defer in order to wait until the element is fully initialized.
		// TODO: Find a better solution.
		_.defer( () => {
			if ( this.isNested() ) {
				this.$el.find( '.elementor-editor-element-add' ).remove();
			}
		} );

		this.$el.html5Droppable( {
			items: '> .elementor-element, > .elementor-empty-view .elementor-first-add, > .elementor-empty-view .e-container-select-preset__inner',
			groups: [ 'elementor-element' ],
			isDroppingAllowed: this.isDroppingAllowed.bind( this ),
			currentElementClass: 'elementor-html5dnd-current-element',
			placeholderClass: 'elementor-sortable-placeholder elementor-widget-placeholder',
			hasDraggingOnChildClass: 'elementor-dragging-on-child',
			onDropping: ( side, event ) => {
				event.stopPropagation();

				// Triggering drag end manually, since it won't fired above iframe
				elementor.getPreviewView().onPanelElementDragEnd();

				const widgets = Object.values( jQuery( event.currentTarget.parentElement ).find( '> .elementor-element' ) );
				let newIndex = widgets.indexOf( event.currentTarget );

				// Plus one in order to insert it after the current target element.
				if ( [ 'bottom', 'right' ].includes( side ) ) {
					newIndex++;
				}

				this.addElementFromPanel( { at: newIndex } );
			},
		} );
	},
} );

module.exports = ContainerView;
