export class Select extends ( $e.modules.document.CommandHistory ) {
	static restore( historyItem, isRedo ) {
		const container = historyItem.get( 'container' ),
			data = historyItem.get( 'data' );

		$e.run( 'nested-elements/nested-repeater/select', {
			container,
			index: isRedo ? data.current : data.prev,
		} );
	}

	validateArgs( args ) {
		this.requireContainer( args );
		this.requireArgumentType( 'index', 'number', args );

		const { containers = [ args.container ] } = args;

		// When there multiple containers, then its not supported.
		if ( containers.length > 1 ) {
			throw new Error( 'Multiple containers are not supported.' );
		}
	}

	getHistory( args ) {
		const { options = { useHistory: true }, container, index } = args;

		if ( ! options.useHistory ) {
			return false;
		}

		const editSettings = container.model.get( 'editSettings' ),
			defaults = container.model.config.defaults,
			repeaterName = defaults.repeater_name,
			repeater = container.repeaters[ repeaterName ],
			tabTitleSetting = defaults.repeater_title_setting,
			tabTitle = repeater.children[ index - 1 ].settings.get( tabTitleSetting );

		return {
			container,
			type: 'selected',
			subTitle: tabTitle,
			restore: this.constructor.restore,
			data: {
				current: index,
				prev: editSettings.get( 'activeItemIndex' ) || 1,
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
