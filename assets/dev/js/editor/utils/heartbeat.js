var heartbeat;

heartbeat = {

	init: function() {
		var modal;

		this.getModal = function() {
			if ( ! modal ) {
				modal = this.initModal();
			}

			return modal;
		};

		Backbone.$( document ).on( {
			'heartbeat-send': function( event, data ) {
				data.elementor_post_lock = {
					post_ID: elementor.config.post_id
				};
			},
			'heartbeat-tick': function( event, response ) {
				if ( response.locked_user ) {
					if ( elementor.isEditorChanged() ) {
						elementor.saveEditor( { status: 'autosave' } );
					}

					heartbeat.showLockMessage( response.locked_user );
				} else {
					heartbeat.getModal().hide();
				}

				elementor.config.nonce = response.elementor_nonce;
			},
			'heartbeat-nonces-expired': function() {
				elementor.showFatalErrorDialog( {
					headerMessage: elementor.translate( 'session_expired_header' ),
					message: elementor.translate( 'session_expired_message' ),
					strings: {
						confirm: elementor.translate( 'reload_page' )
					},
					onConfirm: function() {
						location.reload( true );
					}
				} );
			}
		} );

		if ( elementor.config.locked_user ) {
			heartbeat.showLockMessage( elementor.config.locked_user );
		}
	},

	initModal: function() {
		var modal = elementor.dialogsManager.createWidget( 'options', {
			headerMessage: elementor.translate( 'take_over' )
		} );

		modal.addButton( {
			name: 'go_back',
			text: elementor.translate( 'go_back' ),
			callback: function() {
				parent.history.go( -1 );
			}
		} );

		modal.addButton( {
			name: 'take_over',
			text: elementor.translate( 'take_over' ),
			callback: function() {
				wp.heartbeat.enqueue( 'elementor_force_post_lock', true );
				wp.heartbeat.connectNow();
			}
		} );

		return modal;
	},

	showLockMessage: function( lockedUser ) {
		var modal = heartbeat.getModal();

		modal
			.setMessage( elementor.translate( 'dialog_user_taken_over', [ lockedUser ] ) )
		    .show();
	}
};

module.exports = heartbeat;
