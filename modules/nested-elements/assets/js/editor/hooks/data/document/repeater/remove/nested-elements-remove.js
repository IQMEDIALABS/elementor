import Base from '../base';

export class NestedElementsRemove extends Base {
	getId() {
		return 'nested-elements-remove';
	}

	getCommand() {
		return 'document/repeater/remove';
	}

	apply( args ) {
		const { containers = [ args.container ] } = args;

		containers.forEach( ( container ) => {
			const childView = container.view.children.findByIndex( args.index );

			$e.run( 'document/elements/delete', {
				container: childView.getContainer(),
			} );
		} );
	}
}

export default NestedElementsRemove;
