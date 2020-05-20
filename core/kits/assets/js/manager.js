import Component from './component';
import panelView from './panel';
import panelMenuView from './panel-menu';
import PanelHeaderBehavior from './panel-header-behavior';
import Repeater from './repeater';

export default class extends elementorModules.editor.utils.Module {
	addPanelPages() {
		elementor.getPanelView().addPage( 'kit_settings', {
			view: panelView,
			title: elementor.translate( 'Global Settings' ),
		} );

		elementor.getPanelView().addPage( 'kit_menu', {
			view: panelMenuView,
			title: elementor.translate( 'Global Settings' ),
		} );
	}

	addPanelMenuItem() {
		const menu = elementor.modules.layouts.panel.pages.menu.Menu;

		menu.addItem( {
			name: 'global-settings',
			icon: 'eicon-adjust',
			title: elementor.translate( 'Global Settings' ),
			type: 'page',
			callback: () => $e.route( 'panel/global/menu' ),
		}, 'style', 'global-colors' );
	}

	addHeaderBehavior( behaviors ) {
			behaviors.kit = {
				behaviorClass: PanelHeaderBehavior,
			};

			return behaviors;
	}

	onInit() {
		super.onInit();

		elementorCommon.elements.$window.on( 'elementor:loaded', () => {
			if ( ! elementor.config.initial_document.panel.support_kit ) {
				return;
			}

			if ( ! elementor.config.user.can_edit_kit ) {
				return;
			}

			$e.components.register( new Component( { manager: this } ) );

			elementor.addControlView( 'global-style-repeater', Repeater );

			elementor.hooks.addFilter( 'panel/header/behaviors', this.addHeaderBehavior );

			elementor.on( 'panel:init', () => {
				this.addPanelPages();

				this.addPanelMenuItem();
			} );
		} );
	}
}
