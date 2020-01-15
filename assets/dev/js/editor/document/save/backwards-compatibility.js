import ComponentBase from 'elementor-api/modules/component-base';

export default class BackwardsCompatibility extends ComponentBase {
	__construct( args = {} ) {
		super.__construct( args );

		Object.defineProperty( this, 'autoSaveTimer', {
			get() {
				elementorCommon.helpers.softDeprecated( 'elementor.saver.autoSaveTimer', '2.9.0',
					"$e.components.get('editor/documents').autoSaveTimers" );
				return $e.components.get( 'editor/documents' ).autoSaveTimers;
			},

			set() {
				elementorCommon.helpers.softDeprecated( 'elementor.saver.autoSaveTimer', '2.9.0',
					"$e.components.get('editor/documents').autoSaveTimers" );

				throw Error( 'Deprecated' );
			},
		} );
	}

	defaultSave() {
		elementorCommon.helpers.softDeprecated( 'saveDraft', '2.9.0', "$e.run( 'document/save/default' )" );

		return $e.run( 'document/save/default' );
	}

	discard() {
		elementorCommon.helpers.softDeprecated( 'discard', '2.9.0', "$e.run( 'document/save/discard' )" );

		return $e.run( 'document/save/discard' );
	}

	doAutoSave() {
		elementorCommon.helpers.softDeprecated( 'doAutoSave', '2.9.0', "$e.run( 'document/save/auto' )" );

		return $e.run( 'document/save/auto' );
	}

	publish( options ) {
		elementorCommon.helpers.softDeprecated( 'publish', '2.9.0', "$e.run( 'document/save/publish' )" );

		return $e.run( 'document/save/auto', { options } );
	}

	saveAutoSave( options ) {
		elementorCommon.helpers.softDeprecated( 'saveAutoSave', '2.9.0', "$e.run( 'document/save/auto', { force: true } )" );

		options.force = true;

		return $e.run( 'document/save/auto', options );
	}

	saveDraft() {
		elementorCommon.helpers.softDeprecated( 'saveDraft', '2.9.0', "$e.run( 'document/save/draft' )" );

		return $e.run( 'document/save/draft' );
	}

	savePending( options ) {
		elementorCommon.helpers.softDeprecated( 'savePending', '2.9.0', "$e.run( 'document/save/pending' )" );

		return $e.run( 'document/save/pending' );
	}

	update( options ) {
		elementorCommon.helpers.softDeprecated( 'update', '2.9.0', "$e.run( 'document/save/update' )" );

		return $e.run( 'document/save/update', { options } );
	}

	startTimer( hasChanged ) {
		elementorCommon.helpers.softDeprecated( 'startTimer', '2.9.0',
			"$e.components.get( 'editor/documents' ).startAutoSave" );

		throw Error( 'Deprecated' );
	}
}
