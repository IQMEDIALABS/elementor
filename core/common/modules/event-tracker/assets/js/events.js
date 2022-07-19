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
}
