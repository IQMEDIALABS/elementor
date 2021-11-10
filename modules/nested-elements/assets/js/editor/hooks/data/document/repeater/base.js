export default class Base extends $e.modules.hookData.After {
	getContainerType() {
		return 'widget';
	}

	getConditions( args ) {
		return elementor.modules.nestedElements.isWidgetSupportNesting( args.name );
	}
}
