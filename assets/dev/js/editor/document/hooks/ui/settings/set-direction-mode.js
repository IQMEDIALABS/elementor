import After from 'elementor-api/modules/hooks/ui/after';

/**
 * UI hook to set direction mode when changing element's settings.
 * Currently used to determine the direction of the flex icons in the Container element.
 * It should be generic and work with any element, and since each element might use a different
 * setting to determine its direction mode, the hook should listen to any setting change.
 * Therefore, there isn't a `getConditions()` method.
 */
export class SetDirectionMode extends After {
	getCommand() {
		return 'document/elements/settings';
	}

	getId() {
		return 'set-direction-mode--document/elements/settings';
	}

	apply( args ) {
		SetDirectionMode.set( args.container );
	}

	/**
	 * Get the direction mode from the Container's view & set the UI state accordingly.
	 *
	 * @param {Container} container
	 *
	 * @return {void}
	 */
	static set( container ) {
		// Determine if the direction mode should be set by the parent.
		const useParent = ( 'panel/editor/advanced' === $e.routes.getCurrent( 'panel' ) );

		container = ( useParent ) ? container.parent : container;

		const { view } = container.renderer,
			direction = view.getCurrentUiStates?.().directionMode;

		if ( direction ) {
			$e.uiStates.set( 'document/direction-mode', direction );
			return;
		}

		$e.uiStates.remove( 'document/direction-mode' );
	}
}

export default SetDirectionMode;
