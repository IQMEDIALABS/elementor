import CommandNavigator from './base/command-navigator';

export class ToggleFolding extends CommandNavigator {
	apply( args ) {
		const { containers = [ args.container ], callback, state } = args;

		containers.forEach( ( container ) => {
			if ( ! container.children.length ) {
				return;
			}

			const view = container.args.navigatorView,
				isActive = view.ui.item.hasClass( 'elementor-active' );

			if ( isActive === state ) {
				return;
			}

			const newArgs = { container };

			if ( callback ) {
				newArgs.callback = callback;
			}

			if ( undefined === state ) {
				view.ui.item.toggleClass( 'elementor-active', state );

				view.ui.elements.slideToggle( 300, callback );
			} else if ( state ) {
				$e.run( 'navigator/elements/expand', newArgs );
			} else {
				$e.run( 'navigator/elements/collapse', newArgs );
			}
		} );
	}
}

export default ToggleFolding;
