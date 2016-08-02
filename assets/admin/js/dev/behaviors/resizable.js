var ResizableBehavior;

ResizableBehavior = Marionette.Behavior.extend( {
	defaults: {
		handles: elementor.config.is_rtl ? 'w' : 'e'
	},

	ui: {
		columnTitle: '.column-title'
	},

	events: {
		'resize': 'onResize'
	},

	initialize: function() {
		Marionette.Behavior.prototype.initialize.apply( this, arguments );

		this.listenTo( elementor.dataEditMode, 'switch', this.onEditModeSwitched );
	},

	active: function() {
		var options = _.clone( this.options );

		delete options.behaviorClass;

		var $childViewContainer = this.getChildViewContainer(),
			defaultResizableOptions = {},
			resizableOptions = _.extend( defaultResizableOptions, options );

		$childViewContainer.resizable( resizableOptions );
	},

	deactivate: function() {
		if ( this.getChildViewContainer().resizable( 'instance' ) ) {
			this.getChildViewContainer().resizable( 'destroy' );
		}
	},

	onEditModeSwitched: function() {
		var activeMode = elementor.dataEditMode.request( 'activeMode' );

		if ( 'preview' !== activeMode ) {
			this.active();
		} else {
			this.deactivate();
		}
	},

	onRender: function() {
		// Call this method from other thread (non-block UI)
		_.defer( _.bind( this.onEditModeSwitched, this ) );
	},

	onDestroy: function() {
		this.deactivate();
	},

	onResize: function( event, ui ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize', ui );
	},

	getChildViewContainer: function() {
		return this.$el;
	}
} );

module.exports = ResizableBehavior;
