import { ListenerEvent } from './types';

export function dispatchOnV1Ready() {
	return getV1LoadingPromise().then( () => {
		window.dispatchEvent( new CustomEvent( 'elementor/v1/initialized' ) );
	} );
}

function getV1LoadingPromise() {
	type ExtendedWindow = Window & {
		__elementorEditorV1Loaded: Promise<void>;
	}

	const extendedWindow = window as unknown as ExtendedWindow;

	if ( ! extendedWindow.__elementorEditorV1Loaded ) {
		return Promise.reject( 'Elementor Editor V1 is not loaded' );
	}

	return extendedWindow.__elementorEditorV1Loaded;
}

export function normalizeEvent( e: ListenerEvent['originalEvent'] ) : ListenerEvent {
	if ( e instanceof CustomEvent && e.detail?.command ) {
		return {
			type: 'command',
			command: e.detail.command,
			args: e.detail.args,
			originalEvent: e,
		};
	}

	return {
		type: 'window-event',
		event: e.type,
		originalEvent: e,
	};
}
