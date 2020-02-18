module.exports = class FooterSaver extends Marionette.Behavior {
	previewWindow = null;

	ui() {
		return {
			buttonPreview: '#elementor-panel-footer-saver-preview',
			buttonPublish: '#elementor-panel-saver-button-publish',
			buttonSaveOptions: '#elementor-panel-saver-button-save-options',
			buttonPublishLabel: '#elementor-panel-saver-button-publish-label',
			menuSaveDraft: '#elementor-panel-footer-sub-menu-item-save-draft',
			lastEditedWrapper: '.elementor-last-edited-wrapper',
		};
	}

	events() {
		return {
			'click @ui.buttonPreview': 'onClickButtonPreview',
			'click @ui.buttonPublish': 'onClickButtonPublish',
			'click @ui.menuSaveDraft': 'onClickMenuSaveDraft',
		};
	}

	initialize( options ) {
		this.document = options.document || elementor.documents.getCurrent();

		elementor.on( 'document:loaded', ( document ) => {
			this.setMenuItems( document );
			this.setLastEdited( document.config.last_edited );
		} );

		// TODO: Temp, footerSaver should be removed.
		$e.components.get( 'document/save' ).footerSaver = this;
	}

	activateSaveButtons( document, status ) {
		const hasChanges = status || 'draft' === document.container.settings.get( 'post_status' );

		this.ui.buttonPublish.add( this.ui.menuSaveDraft ).toggleClass( 'elementor-disabled', ! hasChanges );
		this.ui.buttonSaveOptions.toggleClass( 'elementor-disabled', ! hasChanges );
	}

	onRender() {
		this.addTooltip();
	}

	setLastEdited( lastEdited ) {
		this.ui.lastEditedWrapper
			.removeClass( 'elementor-button-state' )
			.find( '.elementor-last-edited' )
			.html( lastEdited );
	}

	async onClickButtonPreview() {
		const document = elementor.documents.getCurrent();

		if ( document.editor.isChanged ) {
			// Force save even if it's saving now.
			await $e.run( 'document/save/auto', {
				force: true,
			} );
		}

		// Open immediately in order to avoid popup blockers.
		this.previewWindow = open( document.config.urls.wp_preview, `wp-preview-${ document.id }` );
	}

	onClickButtonPublish() {
		if ( this.ui.buttonPublish.hasClass( 'elementor-disabled' ) ) {
			return;
		}

		$e.run( 'document/save/default' );
	}

	onClickMenuSaveDraft() {
		$e.run( 'document/save/draft' );
	}

	setMenuItems( document ) {
		const postStatus = document.container.settings.get( 'post_status' );

		let publishLabel = 'publish';

		switch ( postStatus ) {
			case 'publish':
			case 'private':
				publishLabel = 'update';

				if ( document.config.revisions.current_id !== document.id ) {
					this.activateSaveButtons( document, true );
				}

				break;
			case 'draft':
				if ( ! document.config.user.can_publish ) {
					publishLabel = 'submit';
				}

				this.activateSaveButtons( document, true );
				break;
			case 'pending': // User cannot change post status
			case undefined: // TODO: as a contributor it's undefined instead of 'pending'.
				if ( ! document.config.user.can_publish ) {
					publishLabel = 'update';
				}
				break;
		}

		this.ui.buttonPublishLabel.html( elementor.translate( publishLabel ) );
	}

	addTooltip() {
		// Create tooltip on controls
		this.$el.find( '.tooltip-target' ).tipsy( {
			// `n` for down, `s` for up
			gravity: 's',
			title() {
				return this.getAttribute( 'data-tooltip' );
			},
		} );
	}

	refreshWpPreview() {
		if ( this.previewWindow ) {
			// Refresh URL form updated config.
			try {
				this.previewWindow.location.href = elementor.config.document.urls.wp_preview;
			} catch ( e ) {
				// If the this.previewWindow is closed or it's domain was changed.
				// Do nothing.
			}
		}
	}
};
