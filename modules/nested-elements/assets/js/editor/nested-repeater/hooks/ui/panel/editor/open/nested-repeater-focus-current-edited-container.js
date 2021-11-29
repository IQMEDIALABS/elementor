const NAVIGATION_DEPTH_SENSITIVITY_TIMEOUT = 250;

/**
 * Used to open current selected container.
 * Will run 'nested-elements/nested-repeater/select',  over nested elements tree.
 * Will select all repeater nested item(s) till the it reach current repeater of selected element.
 */
export class NestedRepeaterFocusCurrentEditedContainer extends ( $e.modules.hookUI.After ) {
	getCommand() {
		return 'panel/editor/open';
	}

	getId() {
		return 'nested-repeater-focus-current-edited-container';
	}

	getConditions( args ) {
		// Do not select for element creation.
		if ( $e.commands.isCurrentFirstTrace( 'document/elements/create' ) ) {
			return false;
		}

		// If some of the parents are supporting nested elements, then return true.
		const allParents = args.view.container.getParentAncestry(),
			result = allParents.some( ( parent ) =>
				elementor.modules.nestedElements.isWidgetSupportNesting( parent.model.get( 'widgetType' ) )
			);

		if ( result ) {
			this.allParents = allParents;
		}

		return result;
	}

	apply() {
		const navigateMap = this.getNavigationMapForContainers( this.allParents.filter(
				( container ) => 'container' === container.type && 'widget' === container.parent.type
			) ).filter( ( map ) => {
			// Filter out paths that are the same as current.
			return map.index !== map.current;
		} );

		let depth = 1;

		navigateMap.forEach( ( { container, index } ) => {
			setTimeout( () => {
				$e.run( 'nested-elements/nested-repeater/select', {
					container,
					index: index++,
					options: {
						useHistory: false,
					},
				} );
			}, NAVIGATION_DEPTH_SENSITIVITY_TIMEOUT * depth );

			++depth;
        } );
	}

	getNavigationMapForContainers( containers ) {
		return containers.map( ( container ) => {
			return {
				current: container.parent.model.get( 'editSettings' ).get( 'activeItemIndex' ),
				container: container.parent,
				index: container.parent.children.indexOf( container ) + 1,
			};
		} ).reverse();
	}
}

export default NestedRepeaterFocusCurrentEditedContainer;

