module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-elementor-template-library-connect',

	id: 'elementor-template-library-connect',

	ui: {
		connect: '#elementor-template-library-connect__button',
		thumbnails: '#elementor-template-library-connect-thumbnails',
	},

	onRender: function() {
		this.ui.connect.elementorConnect( {
			success: () => {
				elementor.config.library_connect.is_connected = true;

				// If is connecting during insert template.
				if ( this.getOption( 'model' ) ) {
					$e.run( 'library/insert-template', {
						model: this.getOption( 'model' ),
					} );
				} else {
					$e.run( 'library/close' );
					elementor.notifications.showToast( {
						message: elementor.translate( 'connected_successfully' ),
					} );
				}
			},
			error: () => {
				elementor.config.library_connect.is_connected = false;
			},
		} );
	},
} );
