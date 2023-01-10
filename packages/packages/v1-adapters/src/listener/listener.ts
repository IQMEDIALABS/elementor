import { dispatchOnV1Init, makeListener } from './utils';
import { CommandEventDescriptor, EventDescriptor, ListenerCallback, WindowEventDescriptor } from './types';

let callbacksByEvent : Record<EventDescriptor['name'], ListenerCallback[]> = {};
let abortController = new AbortController();

export function listenTo(
	eventDescriptors : EventDescriptor | EventDescriptor[],
	callback : ListenerCallback
) {
	if ( ! Array.isArray( eventDescriptors ) ) {
		eventDescriptors = [ eventDescriptors ];
	}

	eventDescriptors.forEach( ( event ) => {
		const { type, name } = event;

		switch ( type ) {
			case 'command':
				registerCommandListener( name, event.state, callback );
				break;

			case 'window-event':
				registerWindowEventListener( name, callback );
				break;
		}
	} );
}

export function startV1Listeners() {
	Object.entries( callbacksByEvent ).forEach( ( [ event, callbacks ] ) => {
		window.addEventListener(
			event,
			makeListener( event, callbacks ),
			{ signal: abortController.signal }
		);
	} );

	return dispatchOnV1Init();
}

export function flushListeners() {
	abortController.abort();
	callbacksByEvent = {};

	abortController = new AbortController();
}

function registerCommandListener(
	command: CommandEventDescriptor['name'],
	state: CommandEventDescriptor['state'],
	callback: ListenerCallback
) {
	registerWindowEventListener( `elementor/commands/run/${ state }`, ( e ) => {
		if ( e.type === 'command' && e.command === command ) {
			callback( e );
		}
	} );
}

function registerWindowEventListener( event: WindowEventDescriptor['name'], callback: ListenerCallback ) {
	callbacksByEvent[ event ] = callbacksByEvent[ event ] || [];

	callbacksByEvent[ event ].push( callback );
}
