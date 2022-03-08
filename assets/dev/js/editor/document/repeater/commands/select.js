import CommandHistory from 'elementor-document/commands/base/command-history';

/**
 * Command used to select current working repeater item.
 */
export class Select extends CommandHistory {
	static restore( historyItem, isRedo ) {
		const container = historyItem.get( 'container' ),
			data = historyItem.get( 'data' );

		$e.run( 'document/repeater/select', {
			container,
			index: isRedo ? data.current : data.prev,
		} );
	}

	validateArgs( args ) {
		this.requireContainer( args );
		this.requireArgumentType( 'index', 'number', args );

		// When there multiple containers, then its not supported.
		if ( args.containers ) {
			throw new Error( 'Multiple containers are not supported.' );
		}
	}

	getHistory( args ) {
		const { container, index } = args,
			editSettings = container.model.get( 'editSettings' ),
			current = editSettings.get( 'activeItemIndex' ) || 1;

		// If the index is the same, then don't save a history item.
		if ( current === index ) {
			return false;
		}

		return {
			container,
			type: 'selected',
			subTitle: __( 'Item #', 'elementor' ) + index,
			restore: this.constructor.restore,
			data: {
				current: index,
				prev: current,
			},
		};
	}

	/**
	 * @inheritDoc
	 *
	 * @param {Container} container
	 * @param {number} index
	 */
	apply( { container, index } ) {
		const editSettings = container.model.get( 'editSettings' );

		editSettings.set( 'activeItemIndex', index );
	}
}

export default Select;
