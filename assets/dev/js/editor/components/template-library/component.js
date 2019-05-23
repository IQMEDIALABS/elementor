const TemplateLibraryLayoutView = require( 'elementor-templates/views/library-layout' );

export default class extends elementorModules.Component {
	__construct( args ) {
		super.__construct( args );

		this.docLibraryConfig = elementor.config.document.remoteLibrary;

		if ( 'block' === this.docLibraryConfig.type ) {
			this.setDefault( 'templates/block' );
		} else {
			this.setDefault( 'templates/page' );
		}
	}

	getNamespace() {
		return 'library';
	}

	getTabs() {
		// Allow add tabs via `addTab`.
		if ( _.isEmpty( this.tabs ) ) {
			this.tabs = {
				'templates/block': {
					title: elementor.translate( 'blocks' ),
					filter: {
						source: 'remote',
						type: 'block',
						subtype: this.docLibraryConfig.category,
					},
				},
				'templates/page': {
					title: elementor.translate( 'pages' ),
					filter: {
						source: 'remote',
						type: 'page',
					},
				},
				'templates/my-templates': {
					title: elementor.translate( 'my_templates' ),
					filter: {
						source: 'local',
					},
				},
			};
		}

		return this.tabs;
	}

	getRoutes() {
		return {
			import: () => {
				this.context.layout.showImportView();
			},

			'save-template': ( args ) => {
				this.context.layout.showSaveTemplateView( args.model );
			},
		};
	}

	getCommands() {
		return {
			show: this.show,
		};
	}

	getShortcuts() {
		return {
			show: {
				keys: 'ctrl+shift+l',
			},
		};
	}

	getTabsWrapperSelector() {
		return '#elementor-template-library-header-menu';
	}

	renderTab( tab ) {
		this.context.setScreen( this.tabs[ tab ].filter );
	}

	activateTab( tab ) {
		elementorCommon.route.saveState( 'library' );

		super.activateTab( tab );
	}

	open() {
		if ( ! this.context.layout ) {
			this.context.layout = new TemplateLibraryLayoutView();

			this.context.layout.getModal().on( 'hide', () => elementorCommon.route.close( this.getNamespace() ) );
		}

		this.context.layout.showModal();

		return true;
	}

	close() {
		this.context.modalConfig = {};
	}

	show( args ) {
		this.context.modalConfig = args;

		if ( args.toDefault || ! elementorCommon.route.restoreState( 'library' ) ) {
			elementorCommon.route.to( this.getDefault() );
		}
	}
}
