const STATE_ACTIVE = 'active';
const STATE_INACTIVE = 'inactive';
const STATE_DEFAULT = 'default';

export default class ExperimentsMessages {
	elements = {};

	constructor( { selects, submit } ) {
		this.elements = {
			/**
			 * @type {HTMLSelectElement[]}
			 */
			selects,

			/**
			 * @type {HTMLInputElement}
			 */
			submit,
		};
	}

	bindEvents() {
		this.elements.selects.forEach( ( select ) => {
			select.addEventListener( 'change', ( e ) => this.onExperimentStateChange( e ) );
		} );
	}

	onExperimentStateChange( e ) {
		const { experimentId } = e.currentTarget.dataset,
			experimentNewState = this.getExperimentActualState( experimentId ),
			serverState = this.getExperimentData( experimentId ).state;

		switch ( experimentNewState ) {
			case STATE_ACTIVE:
				if ( this.shouldShowDependenciesDialog( experimentId ) ) {
					this.showDialog( this.getDependencyDialogConfig( experimentId ) );
				}
				break;

			case STATE_INACTIVE:
				if ( this.shouldShowDeactivateModal( experimentId ) && serverState !== STATE_INACTIVE ) {
					this.showDialog( this.getMessageDialogConfig( experimentId ) );
				} else {
					this.deactivateDependantExperiments( experimentId );
				}
				break;

			default:
				break;
		}
	}

	getExperimentData( experimentId ) {
		return elementorAdminConfig.experiments[ experimentId ];
	}

	getExperimentDependencies( experimentId ) {
		return this
			.getExperimentData( experimentId )
			.dependencies
			.map( ( dependencyId ) => (
				this.getExperimentData( dependencyId )
			) );
	}

	getMessage( experimentId, messageId = 'on_deactivate' ) {
		return this
			.getExperimentData( experimentId )
			.messages[ messageId ];
	}

	getExperimentSelect( experimentId ) {
		return this.elements.selects.find( ( select ) => select.matches( `[data-experiment-id="${ experimentId }"]` ) );
	}

	setExperimentState( experimentId, state ) {
		this.getExperimentSelect( experimentId ).value = state;
	}

	getExperimentActualState( experimentId ) {
		const state = this.getExperimentSelect( experimentId ).value;

		if ( state !== STATE_DEFAULT ) {
			return state;
		}

		// Normalize the "default" state to the actual state value.
		return this.isExperimentActiveByDefault( experimentId )
			? STATE_ACTIVE
			: STATE_INACTIVE;
	}

	isExperimentActive( experimentId ) {
		return ( this.getExperimentActualState( experimentId ) === STATE_ACTIVE );
	}

	isExperimentActiveByDefault( experimentId ) {
		return ( this.getExperimentData( experimentId ).default === STATE_ACTIVE );
	}

	areAllDependenciesActive( dependencies ) {
		return dependencies.every( ( dependency ) => this.isExperimentActive( dependency.name ) );
	}

	deactivateDependantExperiments( experimentId ) {
		Object
			.entries( elementorAdminConfig.experiments )
			.forEach( ( [ id, experimentData ] ) => {
				const isDependant = ( experimentData.dependencies.includes( experimentId ) ),
					isExpActualStateNotInactive = this.getExperimentActualState( id ) !== STATE_INACTIVE;

				if ( isDependant && isExpActualStateNotInactive ) {
					this.setExperimentState( id, STATE_INACTIVE );
				}
			} );
	}

	shouldShowDependenciesDialog( experimentId ) {
		const dependencies = this.getExperimentDependencies( experimentId );

		return ! this.areAllDependenciesActive( dependencies );
	}

	shouldShowDeactivateModal( experimentId ) {
		return !! this.getMessage( experimentId );
	}

	showDialog( dialog ) {
		return elementorCommon.dialogsManager.createWidget( 'confirm', {
			id: 'e-experiments-messages-dialog',
			headerMessage: dialog.headerMessage,
			message: dialog.message,
			position: {
				my: 'center center',
				at: 'center center',
			},
			strings: {
				confirm: dialog.confirm,
				cancel: dialog.cancel,
			},
			hide: {
				onOutsideClick: false,
				onBackgroundClick: false,
				onEscKeyPress: false,
			},
			onConfirm: () => {
				dialog.onConfirm();
			},
			onCancel: () => {
				this.setExperimentState( dialog.experimentId, dialog.initialState );
			},
		} ).show();
	}

	joinDepenednciesNames( array, glue, finalGlue = '' ) {
		if ( '' === finalGlue ) {
			return array.join( glue );
		}

		if ( ! array.length ) {
			return '';
		}

		if ( 1 === array.length ) {
			return array[ 0 ];
		}

		const clone = [ ...array ],
			lastItem = clone.pop();

		return clone.join( glue ) + finalGlue + lastItem;
	}

	getDependencyDialogConfig( experimentId ) {
		const experiment = this.getExperimentData( experimentId ),
			dialogTitle = experiment.title,
			dialogMessage = this.joinDepenednciesNames( this.getExperimentDependencies( experimentId ).map( ( d ) => d.title ) );

		// Translators: %1$s: Experiment title, %2$s: Message content
		const message = __( 'In order to use %1$s, first you need to activate %2$s.', 'elementor' )
			.replace( '%1$s', `<strong>${ dialogTitle }</strong>` )
			.replace( '%2$s', dialogMessage );

		return {
			message,
			headerMessage: __( 'Activate dialog.', 'elementor' ),
			confirm: __( 'Activate', 'elementor' ),
			cancel: __( 'Cancel', 'elementor' ),
			onConfirm: () => {
				this.getExperimentDependencies( experimentId ).forEach( ( dependency ) => {
					this.setExperimentState( dependency.name, STATE_ACTIVE );
				} );
				this.elements.submit.click();
			},
			initialState: STATE_INACTIVE,
			experimentId,
		};
	}

	getMessageDialogConfig( experimentId ) {
		const experiment = this.getExperimentData( experimentId ),
			dialogTitle = experiment.title,
			dialogMessage = this.getMessage( experimentId );

		// Translators: %1$s: Experiment title, %2$s: Message content
		const message = __( 'While deactivating %1$s, %2$s.', 'elementor' )
			.replace( '%1$s', `<strong>${ dialogTitle }</strong>` )
			.replace( '%2$s', dialogMessage );

		return {
			message,
			headerMessage: __( 'Deactivate dialog.', 'elementor' ),
			confirm: __( 'Deactivate', 'elementor' ),
			cancel: __( 'Dismiss', 'elementor' ),
			onConfirm: () => {
				this.setExperimentState( experimentId, STATE_INACTIVE );
				this.deactivateDependantExperiments( experimentId );
				this.elements.submit.click();
			},
			initialState: STATE_ACTIVE,
			experimentId,
		};
	}
}
