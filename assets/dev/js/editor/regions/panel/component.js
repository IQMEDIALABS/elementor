import ComponentBase from 'elementor-api/modules/component-base';

export default class Component extends ComponentBase {
	getNamespace() {
		return 'panel';
	}

	defaultRoutes() {
		return {
			menu: () => this.manager.setPage( 'menu' ),
			'global-colors': () => this.manager.setPage( 'colorScheme' ),
			'global-fonts': () => this.manager.setPage( 'typographyScheme' ),
			'editor-preferences': () => this.manager.setPage( 'editorPreferences_settings' ).activateTab( 'settings' ),
		};
	}

	defaultCommandsInternal() {
		return {
			'open-default': () => $e.route( elementor.documents.getCurrent().config.panel.default_route ),
			'state-loading': () => elementorCommon.elements.$body.addClass( 'elementor-panel-loading' ),
			'state-ready': () => elementorCommon.elements.$body.removeClass( 'elementor-panel-loading' ),
		};
	}

	defaultCommands() {
		return {
			open: () => new class Open extends $e.modules.CommandBase {
				apply = () => {
					elementor.changeEditMode( 'edit' );
				};
			}().run(),
			close: () => elementor.changeEditMode( 'preview' ),
			toggle: () => elementor.getPanelView().modeSwitcher.currentView.toggleMode(),
			save: () => $e.run( 'document/save/draft' ),
			publish: () => $e.run( 'document/save/publish' ),
			exit: () => $e.route( 'panel/menu' ),
			'change-device-mode': ( args ) => {
				const devices = [ 'desktop', 'tablet', 'mobile' ];
				if ( ! args.device ) {
					const currentDeviceMode = elementor.channels.deviceMode.request( 'currentMode' );
					let modeIndex = devices.indexOf( currentDeviceMode );

					modeIndex++;

					if ( modeIndex >= devices.length ) {
						modeIndex = 0;
					}

					args.device = devices[ modeIndex ];
				}

				elementor.changeDeviceMode( args.device );
			},
		};
	}

	defaultShortcuts() {
		return {
			toggle: {
				keys: 'ctrl+p',
			},
			save: {
				keys: 'ctrl+s',
			},
			exit: {
				keys: 'esc',
				// TODO: replace dependency with scopes.
				dependency: () => {
					return ! jQuery( '.dialog-widget:visible' ).length;
				},
				scopes: [ 'panel', 'preview' ],
			},
			'change-device-mode': {
				keys: 'ctrl+shift+m',
			},
		};
	}
}
