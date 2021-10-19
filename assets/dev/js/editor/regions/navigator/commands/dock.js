import CommandBase from 'elementor-api/modules/command-base';

export class Dock extends CommandBase {
	apply() {
		if ( elementor.navigator.isDocked ) {
			return false;
		}

		// TODO: Hook UI or Use the new uiState manager.
		elementorCommon.elements.$body.addClass( 'elementor-navigator-docked' );

		$e.internal( 'navigator/set-size' );

		const resizableOptions = elementor.navigator.getResizableOptions();

		elementor.navigator.$el.css( {
			height: '',
			top: '',
			bottom: '',
			left: '',
			right: '',
		} );

		if ( elementor.navigator.$el.resizable( 'instance' ) ) {
			elementor.navigator.$el.resizable( 'destroy' );
		}

		resizableOptions.handles = elementorCommon.config.isRTL ? 'e' : 'w';

		elementor.navigator.$el.resizable( resizableOptions );

		elementor.navigator.isDocked = true;

		elementor.navigator.saveStorage( 'docked', true );

		return true;
	}
}

export default Dock;
