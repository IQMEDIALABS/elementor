import CommandsBase from 'elementor-api/modules/command-base';

export class Close extends CommandsBase {
	validateArgs( args ) {
		this.requireArgument( 'id', args );
	}

	apply( args ) {
		const { id, mode, onClose } = args,
			document = elementor.documents.get( id );

		// Already closed.
		if ( 'closed' === document.editor.status ) {
			return jQuery.Deferred().resolve();
		}

		// TODO: Move to an hook.
		if ( ! mode && elementor.saver.isEditorChanged() ) {
			this.getConfirmDialog().show();
			return jQuery.Deferred().reject();
		}

		let deferred;

		switch ( mode ) {
			case 'save':
				deferred = $e.run( 'document/save/update' );
				break;
			case 'discard':
				deferred = $e.run( 'document/save/discard' );

				// TODO: Discard local changes.
				break;
			default:
				deferred = jQuery.Deferred().resolve();
		}

		elementor.saver.stopAutoSave( document );

		elementor.channels.dataEditMode.trigger( 'switch', 'preview' );

		elementor.$previewContents.find( `.elementor-${ id }` )
			.removeClass( 'elementor-edit-area-active' )
			.addClass( 'elementor-edit-area-preview elementor-editor-preview' );

		elementorCommon.elements.$body.removeClass( `elementor-editor-${ document.config.type }` );

		document.editor.status = 'closed';

		if ( onClose ) {
			onClose();
		}

		return deferred;
	}

	getConfirmDialog() {
		if ( this.confirmDialog ) {
			return this.confirmDialog;
		}

		this.confirmDialog = elementorCommon.dialogsManager.createWidget( 'confirm', {
			id: 'elementor-document-save-on-close',
			headerMessage: elementor.translate( 'Save Changes' ),
			message: elementor.translate( 'Would you like to save the changes you\'ve made?' ),
			position: {
				my: 'center center',
				at: 'center center',
			},
			strings: {
				confirm: elementor.translate( 'Save' ),
				cancel: elementor.translate( 'Discard' ),
			},
			onConfirm: () => {
				this.args.mode = 'save';

				// Re-run with same args.
				$e.run( 'editor/documents/close', this.args );
			},
			onCancel: () => {
				this.args.mode = 'discard';

				// Re-run with same args.
				$e.run( 'editor/documents/close', this.args );
			},
		} );

		return this.confirmDialog;
	}
}

export default Close;
