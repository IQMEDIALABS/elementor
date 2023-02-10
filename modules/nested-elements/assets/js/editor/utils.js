export function extractNestedItemTitle( container, index ) {
	const title = container.view.model.config.defaults.elements_title;

	// Translations comes from server side.
	return sprintf( title, index );
}

export function isWidgetSupportNesting( widgetType ) {
	const widgetConfig = elementor.widgetsCache[ widgetType ];

	if ( ! widgetConfig ) {
		return false;
	}

	return widgetConfig.support_nesting;
}

export function findChildContainerOrFail( container, index ) {
	if ( ! elementor.widgetsCache[ container.view.model.config.name ].force_child_container ) {
		return false;
	}

	const childView = container.view.children.findByIndex( index );

	if ( ! childView ) {
		if ( elementor.widgetsCache[ container.view.model.config.name ].force_child_container ) {
			throw new Error( 'Child container was not found for the current repeater item.' );
		} else {
			return false;
		}
	}

	return childView.getContainer();
}
