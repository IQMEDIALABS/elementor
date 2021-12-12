// TODO: Set merge with QUnit helper.

export default class DocumentElementsHelper {
	static createAuto( elType, widgetType = 'button' ) {
		let result = null;

		switch ( elType ) {
			case 'document':
				result = elementor.getPreviewContainer();
				break;

			case 'section':
				result = DocumentElementsHelper.createSection( 1 );
				break;

			case 'container':
				result = DocumentElementsHelper.createContainer();
				break;

			case 'column':
				result = DocumentElementsHelper.createSection( 1, true );
				break;

			case 'widget':
				result = DocumentElementsHelper.createSection( 1, true );
				result = DocumentElementsHelper.createWidget( result, widgetType );
				break;

			case 'innerSection':
				result = DocumentElementsHelper.createInnerSection(
					DocumentElementsHelper.createSection( 1, true )
				);
				break;
		}

		return result;
	}

	/**
	 * @return {Container}
	 */
	static createAutoButton( eContainer = null, settings = {} ) {
		if ( ! eContainer ) {
			eContainer = this.createSection( 1, true );
		}

		return this.createWidgetButton( eContainer, settings );
	}

	static createAutoColumn( eContainer = null, settings = {} ) {
		eContainer = eContainer ? this.createColumn( eContainer ) : this.createSection( 1, true );

		this.settings( eContainer, settings, {
			debounce: false,
		} );

		return eContainer;
	}

	static multiCreateAutoButton( eContainers = null ) {
		if ( ! eContainers ) {
			eContainers = [];
			eContainers.push( this.createSection( 1, true ) );
			eContainers.push( this.createSection( 1, true ) );
		}

		return this.multiCreateButton( eContainers );
	}

	static createSection( columns = 1, returnFirstColumn = false, options = {} ) {
		const eSection = $e.run( 'document/elements/create', {
			model: {
				elType: 'section',
			},
			container: elementor.getPreviewContainer(),
			columns,
			options,
		} );

		if ( returnFirstColumn ) {
			return eSection.children[ 0 ];
		}

		return eSection;
	}

	static createContainer( options = {} ) {
		return $e.run( 'document/elements/create', {
			model: {
				elType: 'container',
			},
			container: elementor.getPreviewContainer(),
			options,
		} );
	}

	static createSectionStructure( columns = 1, structure, returnFirstColumn = false, options = {} ) {
		const eSection = $e.run( 'document/elements/create', {
			model: {
				elType: 'section',
			},
			container: elementor.getPreviewContainer(),
			columns,
			structure,
			options,
		} );

		if ( returnFirstColumn ) {
			return eSection.children[ 0 ];
		}

		return eSection;
	}

	static createColumn( eContainer ) {
		return $e.run( 'document/elements/create', {
			container: eContainer,
			model: {
				elType: 'column',
			},
		} );
	}

	static multiCreateColumn( eContainers ) {
		return $e.run( 'document/elements/create', {
			containers: eContainers,
			model: {
				elType: 'column',
			},
		} );
	}

	static createInnerSection( eContainer ) {
		return $e.run( 'document/elements/create', {
			container: eContainer,
			model: {
				elType: 'section',
				isInner: true,
			},
		} );
	}

	static multiCreateInnerSection( eContainers ) {
		return $e.run( 'document/elements/create', {
			containers: eContainers,
			model: {
				elType: 'section',
				isInner: true,
			},
		} );
	}

	static resizeColumn( eContainer, width ) {
		$e.run( 'document/elements/settings', {
			container: eContainer,
			settings: {
				_inline_size: width,
			},
			options: {
				debounce: false,
			},
		} );
	}

	static createWidget( eContainer, widgetType, settings = {}, options = {} ) {
		return $e.run( 'document/elements/create', {
			container: eContainer,
			model: {
				elType: 'widget',
				widgetType,
				settings,
			},
			options,
		} );
	}

	static createWidgetMulti( eContainers, widgetType, settings = {}, options = {} ) {
		return $e.run( 'document/elements/create', {
			containers: eContainers,
			model: {
				elType: 'widget',
				widgetType,
				settings,
			},
			options,
		} );
	}

	static createWidgetButton( eContainer, settings = {} ) {
		return this.createWidget( eContainer, 'button', settings );
	}

	static multiCreateButton( eContainers, settings = {} ) {
		return this.createWidgetMulti( eContainers, 'button', settings );
	}

	static createWidgetTabs( eContainer ) {
		return this.createWidget( eContainer, 'tabs' );
	}

	static copy( eContainer ) {
		$e.run( 'document/elements/copy', {
			container: eContainer,
		} );
	}

	static multiCopy( eContainers ) {
		$e.run( 'document/elements/copy', {
			containers: eContainers,
		} );
	}

	static copyAll() {
		$e.run( 'document/elements/copy-all' );
	}

	static paste( eContainer, rebuild = false ) {
		return $e.run( 'document/elements/paste', {
			container: eContainer,
			rebuild,
		} );
	}

	static multiPaste( eContainers ) {
		return $e.run( 'document/elements/paste', {
			containers: eContainers,
		} );
	}

	static pasteStyle( eContainer ) {
		$e.run( 'document/elements/paste-style', {
			container: eContainer,
		} );
	}

	static multiPasteStyle( eContainers ) {
		$e.run( 'document/elements/paste-style', {
			containers: eContainers,
		} );
	}

	static resetSettings( eContainer, settings = null ) {
		$e.run( 'document/elements/reset-settings', {
			container: eContainer,
			settings,
		} );
	}

	static resetStyle( eContainer ) {
		$e.run( 'document/elements/reset-style', {
			container: eContainer,
		} );
	}

	static multiResetStyle( eContainers ) {
		$e.run( 'document/elements/reset-style', {
			containers: eContainers,
		} );
	}

	static multiResetSettings( eContainers, settings = null ) {
		$e.run( 'document/elements/reset-settings', {
			containers: eContainers,
			settings,
		} );
	}

	static duplicate( eContainer ) {
		return $e.run( 'document/elements/duplicate', {
			container: eContainer,
		} );
	}

	static multiDuplicate( eContainers ) {
		return $e.run( 'document/elements/duplicate', {
			containers: eContainers,
		} );
	}

	static settings( eContainer, settings, options = {} ) {
		$e.run( 'document/elements/settings', {
			container: eContainer,
			settings,
			options,
		} );
	}

	static multiSettings( eContainers, settings ) {
		$e.run( 'document/elements/settings', {
			containers: eContainers,
			settings,
		} );
	}

	static move( eContainer, eTarget, options = {} ) {
		$e.run( 'document/elements/move', {
			container: eContainer,
			target: eTarget,
			options,
		} );
	}

	static multiMove( eContainers, eTarget, options = {} ) {
		$e.run( 'document/elements/move', {
			containers: eContainers,
			target: eTarget,
			options,
		} );
	}

	static delete( eContainer ) {
		$e.run( 'document/elements/delete', {
			container: eContainer,
		} );
	}

	static multiDelete( eContainers ) {
		$e.run( 'document/elements/delete', {
			containers: eContainers,
		} );
	}

	static empty() {
		$e.run( 'document/elements/empty', { force: true } );
	}

	static import( data, model, options = {} ) {
		return $e.run( 'document/elements/import', { data, model, options } );
	}
}
