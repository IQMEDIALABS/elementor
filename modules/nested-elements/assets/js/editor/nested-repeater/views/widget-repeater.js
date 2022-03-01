/**
 * @extends {BaseWidget}
 */
export class WidgetRepeater extends elementor.modules.elements.views.BaseWidget {
	events() {
		const events = super.events();

		events.click = ( e ) => {
			const closest = e.target.closest( '.elementor-element' );

			let model = this.options.model,
				view = this;

			// For clicks on container.
			if ( 'container' === closest?.dataset.element_type ) { // eslint-disable-line camelcase
				// In case the container empty, click should be handled by the EmptyView.
				const container = elementor.getContainer( closest.dataset.id );

				if ( container.view.isEmpty() ) {
					return true;
				}

				// If not empty, open it.
				model = container.model;
				view = container.view;
			}

			e.stopPropagation();

			$e.run( 'panel/editor/open', {
				model,
				view,
			} );
		};

		return events;
	}

	/**
	 * @inheritDoc
	 *
	 * Sometimes the children placement is not in the end of the element, but somewhere else, eg: deep inside the element template.
	 * If `defaults_placeholder_selector` is set, it will be used to find the correct place to insert the children.
	 */
	getChildViewContainer( containerView, childView ) {
		const customSelector = this.model.config.defaults.elements_placeholder_selector;

		if ( customSelector ) {
			return containerView.$el.find( this.model.config.defaults.elements_placeholder_selector );
		}

		return super.getChildViewContainer( containerView, childView );
	}

	getChildType() {
		return [ 'container' ];
	}

	onRender() {
		super.onRender();

		const editModel = this.getEditModel(),
			skinType = editModel.getSetting( '_skin' ) || 'default';

		// To support handlers - Copied from widget-base.
		this.$el
			.attr( 'data-widget_type', editModel.get( 'widgetType' ) + '.' + skinType )
			.removeClass( 'elementor-widget-empty' )
			.children( '.elementor-widget-empty-icon' )
			.remove();
	}
}

module.exports = WidgetRepeater;
