import CommandHookable from 'elementor-api/modules/command-hookable';
import History from '../history';

export const DEFAULT_DEBOUNCE_DELAY = 800;

/**
 * Function getDefaultDebounceDelay().
 *
 * Returns default debounce delay time, if exists in config override.
 *
 * @returns {number}
 */
export const getDefaultDebounceDelay = () => {
	let result = DEFAULT_DEBOUNCE_DELAY;

	if ( elementor.config.document && undefined !== elementor.config.document.debounceDelay ) {
		result = elementor.config.document.debounceDelay;
	}

	return result;
};

export default class Debounce extends History {
	/**
	 * Function debounce().
	 *
	 * Will debounce every function you pass in, at the same debounce flow.
	 *
	 * @param {(function())}
	 */
	static debounce = undefined;

	initialize( args ) {
		const { options = {} } = args;

		super.initialize( args );

		if ( ! this.constructor.debounce ) {
			this.constructor.debounce = _.debounce( ( fn ) => fn(), getDefaultDebounceDelay() );
		}

		// If its head command, and not called within another command.
		if ( 1 === $e.commands.currentTrace.length || options.debounce ) {
			this.isDebounceRequired = true;
		}
	}

	onBeforeRun( args ) {
		CommandHookable.prototype.onBeforeRun.call( this, args );

		if ( this.history && this.isHistoryActive() ) {
			$e.internal( 'document/history/add-transaction', this.history );
		}
	}

	onAfterRun( args, result ) {
		CommandHookable.prototype.onAfterRun.call( this, args, result );

		if ( this.isHistoryActive() ) {
			if ( this.isDebounceRequired ) {
				this.constructor.debounce( () => $e.internal( 'document/history/end-transaction' ) );
			} else {
				$e.internal( 'document/history/end-transaction' );
			}
		}
	}

	onCatchApply( e ) {
		CommandHookable.prototype.onCatchApply.call( this, e );

		// Rollback history on failure.
		if ( e instanceof $e.modules.HookBreak && this.history ) {
			if ( this.isDebounceRequired ) {
				// `clear-transaction` is under debounce, because it should `clear-transaction` after `end-transaction`.
				this.constructor.debounce( () => $e.internal( 'document/history/clear-transaction' ) );
			} else {
				$e.internal( 'document/history/clear-transaction' );
			}
		}
	}
}
