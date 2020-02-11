const TabHistoryView = require( './tab' );

import TabRevisionsLoadingView from 'elementor/modules/history/assets/js/revisions/panel/loading';
import TabRevisionsView from 'elementor/modules/history/assets/js/revisions/panel/tab';
import TabRevisionsEmptyView from 'elementor/modules/history/assets/js/revisions/panel/empty';

/**
 * TODO: Move to es6.
 */
module.exports = Marionette.LayoutView.extend( {
	template: '#tmpl-elementor-panel-history-page',

	regions: {
		content: '#elementor-panel-history-content',
	},

	ui: {
		tabs: '.elementor-panel-navigation-tab',
	},

	regionViews: {},

	currentTab: null,

	/**
	 * @type {Document}
	 */
	document: null,

	initialize: function( options ) {
		this.document = options.document || elementor.documents.getCurrent();

		this.initRegionViews();
	},

	initRegionViews: function() {
		const historyItems = this.document.history.getItems();

		this.regionViews = {
			actions: {
				view: () => {
					return TabHistoryView;
				},
				options: {
					collection: historyItems,
					history: this.document.history,
				},
			},
			revisions: {
				view: () => {
					const revisionsItems = this.document.revisions.getItems();

					if ( ! revisionsItems ) {
						return TabRevisionsLoadingView;
					}

					if ( 1 === revisionsItems.length && 'current' === revisionsItems.models[ 0 ].get( 'type' ) ) {
						return TabRevisionsEmptyView;
					}

					return TabRevisionsView;
				},
				options: {
					document: this.document,
				},
			},
		};
	},

	getCurrentTab: function() {
		return this.currentTab;
	},

	showView: function( viewName ) {
		const viewDetails = this.regionViews[ viewName ],
			options = viewDetails.options || {},
			View = viewDetails.view();

		if ( this.currentTab && this.currentTab.constructor === View ) {
			return;
		}

		this.currentTab = new View( options );

		this.content.show( this.currentTab );
	},
} );
