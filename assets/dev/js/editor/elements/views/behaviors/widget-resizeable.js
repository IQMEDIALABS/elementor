export default class extends Marionette.Behavior {
	events() {
		return {
			resizestart: 'onResizeStart',
			resizestop: 'onResizeStop',
			resize: 'onResize',
		};
	}

	initialize() {
		super.initialize();

		this.listenTo( elementor.channels.dataEditMode, 'switch', this.toggle );

		// Save this instance for external use eg: ( hooks ).
		this.view.options.resizeable = this;
	}

	/**
	 * Get the resizable options object.
	 *
	 * @return {Object}
	 */
	getOptions() {
		// jQuery UI handles are using Cardinal Directions (n, e, s, w, etc.).
		let handles = 'e, w';

		// If it's a container item, add resize handles only at the end of the element in order to prevent UI
		// glitches when resizing from start.
		if ( this.isContainerItem() ) {
			handles = elementorCommon.config.isRTL ? 'w' : 'e';
		}

		return {
			handles,
		};
	}

	activate() {
		this.$el.resizable( this.getOptions() );
	}

	deactivate() {
		if ( ! this.$el.resizable( 'instance' ) ) {
			return;
		}

		this.$el.resizable( 'destroy' );
	}

	toggle() {
		const editModel = this.view.getEditModel(),
			isAbsolute = editModel.getSetting( '_position' ),
			isInline = 'initial' === editModel.getSetting( '_element_width' );

		this.deactivate();

		if ( ( ( isAbsolute || isInline ) && this.view.container.isDesignable() ) || this.isContainerItem() ) {
			this.activate();
		}
	}

	/**
	 * Determine if the current element is a flex container item.
	 *
	 * @returns {boolean}
	 */
	isContainerItem() {
		return 'container' === this.view.getContainer().parent?.model?.get( 'elType' );
	}

	/**
	 * Get the parent container flex direction.
	 *
	 * @returns {null|string}
	 */
	getParentFlexDirection() {
		if ( ! this.isContainerItem() ) {
			return null;
		}

		const currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
			deviceSuffix = 'desktop' === currentDeviceMode ? '' : '_' + currentDeviceMode;

		return this.view.getContainer().parent?.model?.getSetting( `flex_direction${ deviceSuffix }` );
	}

	onRender() {
		_.defer( () => this.toggle() );
	}

	onDestroy() {
		this.deactivate();
	}

	onResizeStart( event ) {
		event.stopPropagation();

		// Don't open edit mode when the item is a Container item ( for UX ).
		if ( ! this.isContainerItem() ) {
			this.view.model.trigger( 'request:edit' );
		}
	}

	onResizeStop( event, ui ) {
		event.stopPropagation();

		const currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
			deviceSuffix = 'desktop' === currentDeviceMode ? '' : '_' + currentDeviceMode,
			editModel = this.view.getEditModel(),
			widthKey = ( 'container' === this.view.model.get( 'elType' ) ) ? 'width' : '_element_custom_width',
			unit = editModel.getSetting( widthKey + deviceSuffix ).unit,
			width = elementor.helpers.elementSizeToUnit( this.$el, ui.size.width, unit ),
			settingToChange = {};

		settingToChange[ '_element_width' + deviceSuffix ] = 'initial';
		settingToChange[ widthKey + deviceSuffix ] = { unit, size: width };

		$e.run( 'document/elements/settings', {
			container: this.view.container,
			settings: settingToChange,
			options: {
				external: true,
			},
		} );

		this.$el.css( {
			width: '',
			height: '',
			left: '',
			flexBasis: '',
		} );
	}

	onResize( event, ui ) {
		event.stopPropagation();

		if ( ! this.isContainerItem() ) {
			return;
		}

		// Set grow & shrink to 0 in order to set a specific size and prevent UI glitches.
		this.$el.css( {
			left: '',
			right: '',
			'flex-shrink': 0,
			'flex-grow': 0,
			'flex-basis': ui.size.width + 'px',
		} );
	}
}
