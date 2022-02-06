import CommandHistory from 'elementor-document/commands/base/command-history';

export class Import extends CommandHistory {
	validateArgs( args ) {
		this.requireArgumentInstance( 'model', Backbone.Model, args );

		this.requireArgumentConstructor( 'data', Object, args );

		if ( args.containers ) {
			throw new TypeError( 'Multi containers are not supported' );
		}

		if ( args.container ) {
			this.requireContainer();
		}
	}

	getHistory( args ) {
		const { model } = args;

		return {
			type: 'add',
			title: __( 'Template', 'elementor' ),
			subTitle: model.get( 'title' ),
		};
	}

	apply( args ) {
		const { data, options = args.options || {} } = args,
			container = args.container || elementor.getPreviewContainer(),
			result = [];

		let at = isNaN( options.at ) ? container.view.collection.length : options.at;

		// Each `data.content`.
		Object.values( data.content ).forEach( ( model ) => {
			result.push( $e.run( 'document/elements/create', {
				container,
				model,
				options: Object.assign( options, { at } ),
			} ) );
			at++;
		} );

		if ( options.withPageSettings ) {
			$e.run( 'document/elements/settings', {
				container: elementor.settings.page.getEditedView().getContainer(),
				settings: data.page_settings,
				options: {
					external: true,
				},
			} );
		}

		return result;
	}
}

export default Import;
