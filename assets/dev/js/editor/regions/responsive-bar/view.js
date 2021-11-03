export default class View extends Marionette.ItemView {
	getTemplate() {
		return '#tmpl-elementor-templates-responsive-bar';
	}

	id() {
		return 'e-responsive-bar';
	}

	ui() {
		const prefix = '#' + this.id();

		return {
			//actions
			wpDashboard: '#elementor-panel-footer-sub-menu-item-wp-dashboard',
			themeBuilder: '#elementor-panel-footer-sub-menu-item-theme-builder',
			addWidgets: '#elementor-panel-footer-add-widgets',
			pageSettings: '#elementor-panel-footer-sub-menu-item-page-settings',
			siteSettings: '#elementor-panel-footer-sub-menu-item-site-settings',
			preferences: '#elementor-panel-footer-sub-menu-item-preferences',
			keyboardShortcuts: '#elementor-panel-footer-sub-menu-item-keyboard-shortcuts',
			//view
			menuButtons: '.elementor-panel-footer-tool',
			switcherInput: '.e-responsive-bar-switcher__option input',
			switcherLabel: '.e-responsive-bar-switcher__option',
			switcher: prefix + '-switcher',
			sizeInputWidth: prefix + '__input-width',
			sizeInputHeight: prefix + '__input-height',
			scaleValue: prefix + '-scale__value',
			scalePlusButton: prefix + '-scale__plus',
			scaleMinusButton: prefix + '-scale__minus',
			scaleResetButton: prefix + '-scale__reset',
			breakpointSettingsButton: prefix + '__settings-button',
			//actions
			buttonPreview: '#elementor-panel-footer-saver-preview',
			settings: '#elementor-panel-footer-page-settings',
			saveTemplate: '#elementor-panel-footer-sub-menu-item-save-template',
			history: '#elementor-panel-footer-history',
			navigator: '#elementor-panel-footer-navigator',
			finder: '#elementor-panel-footer-finder',
		};
	}

	events() {
		return {
			//actions
			'click @ui.themeBuilder': 'onThemeBuilderClick',
			'click @ui.wpDashboard': 'onWpDashboardClick',
			'click @ui.addWidgets': 'onAddWidgetsClick',
			'click @ui.pageSettings': 'onPageSettingsClick',
			'click @ui.siteSettings': 'onSiteSettingsClick',
			'click @ui.preferences': 'onPreferencesClick',
			'click @ui.keyboardShortcuts': 'onKeyboardShortcutsClick',
			//view
			'click @ui.menuButtons': 'onMenuButtonsClick',
			'change @ui.switcherInput': 'onBreakpointSelected',
			'input @ui.sizeInputWidth': 'onSizeInputChange',
			'input @ui.sizeInputHeight': 'onSizeInputChange',
			'click @ui.scalePlusButton': 'onScalePlusButtonClick',
			'click @ui.scaleMinusButton': 'onScaleMinusButtonClick',
			'click @ui.scaleResetButton': 'onScaleResetButtonClick',
			'click @ui.breakpointSettingsButton': 'onBreakpointSettingsOpen',
			//actions
			'click @ui.buttonPreview': 'onClickButtonPreview',
			'click @ui.settings': 'onSettingsClick',
			'click @ui.saveTemplate': 'onSaveTemplateClick',
			'click @ui.history': 'onHistoryClick',
			'click @ui.navigator': 'onNavigatorClick',
			'click @ui.finder': 'onFinderClick',

		};
	}

	behaviors() {
		var behaviors = {
			saver: {
				behaviorClass: elementor.modules.components.saver.behaviors.FooterSaver,
			},
		};

		return elementor.hooks.applyFilters( 'panel/footer/behaviors', behaviors, this );
	}

	initialize() {
		this.listenTo( elementor.channels.deviceMode, 'change', this.onDeviceModeChange );
		this.listenTo( elementor.channels.responsivePreview, 'resize', this.onPreviewResize );
		this.listenTo( elementor.channels.deviceMode, 'close', this.resetScale );
	}

	// addTipsyToIconButtons() {
	// 	this.ui.switcherLabel.add( this.ui.breakpointSettingsButton ).tipsy(
	// 		{
	// 			html: true,
	// 			gravity: 'n',
	// 			title() {
	// 				return jQuery( this ).data( 'tooltip' );
	// 			},
	// 		}
	// 	);
	// }

	restoreLastValidPreviewSize() {
		const lastSize = elementor.channels.responsivePreview.request( 'size' );

		this.ui.sizeInputWidth
			.val( lastSize.width )
			.tipsy( {
				html: true,
				trigger: 'manual',
				gravity: 'n',
				title: () => __( 'The value inserted isn\'t in the breakpoint boundaries', 'elementor' ),
			} );

		const tipsy = this.ui.sizeInputWidth.data( 'tipsy' );

		tipsy.show();

		setTimeout( () => tipsy.hide(), 3000 );
	}

	autoScale() {
		const handlesWidth = 40 * this.scalePercentage / 100,
			previewWidth = elementor.$previewWrapper.width() - handlesWidth,
			iframeWidth = parseInt( elementor.$preview.css( '--e-editor-preview-width' ) ),
			iframeScaleWidth = iframeWidth * this.scalePercentage / 100;

		if ( iframeScaleWidth > previewWidth ) {
			const scalePercentage = previewWidth / iframeWidth * 100;

			this.setScalePercentage( scalePercentage );
		} else {
			this.setScalePercentage();
		}

		this.scalePreview();
	}

	scalePreview() {
		const scale = this.scalePercentage / 100;
		elementor.$previewWrapper.css( '--e-preview-scale', scale );
	}

	resetScale() {
		this.setScalePercentage();
		this.scalePreview();
	}

	setScalePercentage( scalePercentage = 100 ) {
		this.scalePercentage = scalePercentage;
		this.ui.scaleValue.text( parseInt( this.scalePercentage ) );
	}

	onRender() {
		// this.addTipsyToIconButtons();
		this.setScalePercentage();
	}

	onDeviceModeChange() {
		const currentDeviceMode = elementor.channels.deviceMode.request( 'currentMode' ),
			$currentDeviceSwitcherInput = this.ui.switcherInput.filter( '[value=' + currentDeviceMode + ']' );

		this.ui.switcherLabel.attr( 'aria-selected', false ).removeClass( 'active' );
		$currentDeviceSwitcherInput.closest( 'label' ).attr( 'aria-selected', true ).addClass( 'active' );

		if ( ! $currentDeviceSwitcherInput.prop( 'checked' ) ) {
			$currentDeviceSwitcherInput.prop( 'checked', true );
		}
	}

	onBreakpointSelected( e ) {
		const selectedDeviceMode = e.target.value;

		elementor.changeDeviceMode( selectedDeviceMode, false );

		this.autoScale();
	}

	onBreakpointSettingsOpen() {
		const isWPPreviewMode = elementorCommon.elements.$body.hasClass( 'elementor-editor-preview' );

		if ( isWPPreviewMode ) {
			elementor.exitPreviewMode();
		}

		const isInSettingsPanelActive = 'panel/global/menu' === elementor.documents.currentDocument.config.panel.default_route;

		if ( isInSettingsPanelActive ) {
			$e.run( 'panel/global/close' );

			return;
		}

		//  Open Settings Panel for Global/Layout/Breakpoints Settings
		$e.run( 'editor/documents/switch', {
			id: elementor.config.kit_id,
			mode: 'autosave',
		} )
			.then( () => $e.route( 'panel/global/settings-layout' ) )
			// TODO: Replace with a standard routing solution once one is available
			.then( () => jQuery( '.elementor-control-section_breakpoints' ).trigger( 'click' ) );
	}

	onPreviewResize() {
		if ( this.updatingPreviewSize ) {
			return;
		}

		const size = elementor.channels.responsivePreview.request( 'size' );

		this.ui.sizeInputWidth.val( Math.round( size.width ) );
		this.ui.sizeInputHeight.val( Math.round( size.height ) );
	}

	onSizeInputChange() {
		clearTimeout( this.restorePreviewSizeTimeout );

		const size = {
			width: this.ui.sizeInputWidth.val(),
			height: this.ui.sizeInputHeight.val(),
		};

		const currentDeviceConstrains = elementor.getCurrentDeviceConstrains();

		if ( size.width < currentDeviceConstrains.minWidth || size.width > currentDeviceConstrains.maxWidth ) {
			this.restorePreviewSizeTimeout = setTimeout( () => this.restoreLastValidPreviewSize(), 1500 );

			return;
		}

		this.updatingPreviewSize = true;

		setTimeout( () => this.updatingPreviewSize = false, 300 );

		elementor.updatePreviewSize( size );

		this.autoScale();
	}

	onScalePlusButtonClick() {
		const scaleUp = 0 === this.scalePercentage % 10 ? this.scalePercentage + 10 : Math.ceil( this.scalePercentage / 10 ) * 10;

		if ( scaleUp > 200 ) {
			return;
		}

		this.setScalePercentage( scaleUp );
		this.scalePreview();
	}

	onScaleMinusButtonClick() {
		const scaleDown = 0 === this.scalePercentage % 10 ? this.scalePercentage - 10 : Math.floor( this.scalePercentage / 10 ) * 10;

		if ( scaleDown < 50 ) {
			return;
		}

		this.setScalePercentage( scaleDown );
		this.scalePreview();
	}

	onScaleResetButtonClick() {
		this.resetScale();
	}

	onMenuButtonsClick( event ) {
		var $tool = jQuery( event.currentTarget );

		// If the tool is not toggleable or the click is inside of a tool
		if ( ! $tool.hasClass( 'elementor-toggle-state' ) || jQuery( event.target ).closest( '.elementor-panel-footer-sub-menu-item' ).length ) {
			return;
		}

		var isOpen = $tool.hasClass( 'elementor-open' );

		this.ui.menuButtons.not( '.elementor-leave-open' ).removeClass( 'elementor-open' );

		if ( ! isOpen ) {
			$tool.addClass( 'elementor-open' );
		}
	}

	onClickButtonPreview() {
		$e.run( 'editor/documents/preview', { id: elementor.documents.getCurrent().id } );
	}

	onSettingsClick() {
		$e.route( 'panel/page-settings/settings' );
	}

	onSaveTemplateClick() {
		$e.route( 'library/save-template' );
	}

	onHistoryClick() {
		$e.route( 'panel/history/actions' );
	}

	onNavigatorClick() {
		$e.run( 'navigator/toggle' );
	}

	onFinderClick() {
		$e.route( 'finder' );
	}

	onThemeBuilderClick() {
		$e.run( 'app/open' );
	}

	onWpDashboardClick() {
		window.location.href = elementor.config.document.urls.exit_to_dashboard;
	}

	onAddWidgetsClick() {
		$e.route( 'panel/elements/categories' );
	}

	onPageSettingsClick() {
		$e.route( 'panel/page-settings/settings' );
	}

	onSiteSettingsClick() {
		$e.run( 'panel/global/open', {
			route: $e.routes.getHistory( 'panel' ).reverse()[ 0 ].route,
		} );
	}

	onPreferencesClick() {
		$e.route( 'panel/editor-preferences' );
	}

	onKeyboardShortcutsClick() {
		$e.route( 'shortcuts' );
	}
}
