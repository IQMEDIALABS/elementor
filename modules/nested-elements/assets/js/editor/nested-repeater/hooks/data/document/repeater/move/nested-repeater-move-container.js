import Base from '../../../base';
import {
	findChildContainerOrFail,
	shouldUseImprovedRepeaters,
} from 'elementor/modules/nested-elements/assets/js/editor/utils';

export class NestedRepeaterMoveContainer extends Base {
	getId() {
		return 'document/repeater/move--nested-repeater-move-container';
	}

	getCommand() {
		return 'document/repeater/move';
	}

	apply( { container, sourceIndex, targetIndex } ) {
		$e.run( 'document/elements/move', {
			container: findChildContainerOrFail( container, sourceIndex ),
			target: container,
			options: {
				at: targetIndex,
				edit: false, // Not losing focus.
			},
		} );

		const widgetType = container.settings.get( 'widgetType' );

		if ( shouldUseImprovedRepeaters( widgetType ) ) {
			elementor.$preview[ 0 ].contentWindow.dispatchEvent(
				new CustomEvent( 'elementor/nested-container/created', {
					detail: { container, targetIndex },
				} ),
			);
		}
	}
}

export default NestedRepeaterMoveContainer;
