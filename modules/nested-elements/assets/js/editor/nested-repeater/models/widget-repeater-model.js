/**
 * @extends {ElementModel}
 */
export default class WidgetRepeaterModel extends elementor.modules.elements.models.Element {
	initialize( options ) {
		this.config = elementor.widgetsCache[ options.widgetType ];

		if ( $e.commands.isCurrentFirstTrace( 'document/elements/create' ) ) {
			this.onElementCreate();
		}

		super.initialize( options );
	}

	isValidChild( childModel ) {
		const parentElType = this.get( 'elType' ),
			childElType = childModel.get( 'elType' );

		return 'container' === childElType &&
			'widget' === parentElType &&
			elementor.modules.nestedElements.isWidgetSupportNesting( this.get( 'widgetType' ) );
	}

	getDefaultChildren() {
		// eslint-disable-next-line camelcase
		const { defaults } = this.config,
			result = [];

		defaults.elements.forEach( ( element ) => {
			element.id = elementorCommon.helpers.getUniqueId();
			element.settings = new Backbone.Model( element.settings || {} );
			element.elements = element.elements || [];

			const elementType = elementor.getElementType( element.elType, element.widgetType ),
				ModelClass = elementType.getModel();

			result.push( new ModelClass( element ) );
		} );

		return result;
	}

	onElementCreate() {
		this.set( 'elements', this.getDefaultChildren() );
	}
}
