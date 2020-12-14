export class LandingPageAddLibraryTab extends $e.modules.hookUI.After {
	getCommand() {
		return 'editor/documents/open';
	}

	getId() {
		return 'elementor-landing-pages-add-library-tab';
	}

	getConditions( args ) {
		const document = elementor.documents.get( args.id );
		return 'landing-page' === document.config.type;
	}

	apply() {
		$e.components.get( 'library' ).addTab( 'templates/landing-pages', {
			title: elementor.translate( 'landing_pages' ),
			filter: {
				source: 'remote',
				type: 'lp',
			},
		}, 2 );
	}
}

export default LandingPageAddLibraryTab;
