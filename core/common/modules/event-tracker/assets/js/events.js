import getUserTimestamp from 'elementor-utils/time';
import { eventTrackingObject } from 'elementor-app/consts/consts';

export default class Events {
	dispatchEvent( eventData ) {
		if ( ! eventData ) {
			return;
		}

		eventData.ts = getUserTimestamp();

		// No need to wait for response, no need to block browser in any way.
		$e.data.create( 'event-tracker/index', {
			event_data: eventData,
		} );
	}

	/**
	 * New event tracking function.
	 * @param eventData
	 * @param command - Optional. The command name.
	 */
	dispatchEventObject( eventData, command ) {
		if ( ! eventData ) {
			return;
		}
		const eventCommand = ! command ? 'event-tracker/index' : command;

		eventData.ts = getUserTimestamp();

		// No need to wait for response, no need to block browser in any way.
		$e.data.create( eventCommand, {
			event_data: eventData,
		} );
	}

	// TODO: Delete this function!!
	appsEventTracking = ( command, userActions, metadata ) => {
		$e.run( command, userActions, metadata );
		// eventTrackingObjectData.ts = getUserTimestamp();
			const eventParams = {
				...eventTrackingObject,
				...eventTrackingObjectData,
				details: {
					...eventTrackingObject.details,
					...details,
				},
			};
			console.log( 'eventParams', eventParams );
			$e.run( trackName, eventParams );
		};
}
