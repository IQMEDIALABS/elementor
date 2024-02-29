import Base from '../../../base';
import { findChildContainerOrFail, shouldUseImprovedRepeaters } from 'elementor/modules/nested-elements/assets/js/editor/utils';

export class NestedRepeaterDuplicateContainer extends Base {
	getId() {
		return 'document/repeater/duplicate--nested-repeater-duplicate-container';
	}

	getCommand() {
		return 'document/repeater/duplicate';
	}

	apply( { container, index } ) {
		$e.run( 'document/elements/duplicate', {
			container: findChildContainerOrFail( container, index ),
			options: {
				edit: false, // Not losing focus.
			},
		} );

		const widgetType = container.settings.get( 'widgetType' );

		if ( shouldUseImprovedRepeaters( widgetType ) ) {
			elementor.$preview[ 0 ].contentWindow.dispatchEvent(
				new CustomEvent( 'elementor/nested-container/created', {
					detail: {
						container,
					} },
				) );
		} else {
			container.render();
		}
	}
}

export default NestedRepeaterDuplicateContainer;
