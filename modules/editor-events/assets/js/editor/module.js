export default class extends elementorModules.Module {
	types = {
		click: 'click',
	};

	events = {
		site_settings: 'site_settings',
	};

	sendEvent( data ) {
		if ( ! elementor.config.editor_events.can_send_events ) {
			return;
		}

		if ( navigator.sendBeacon( elementor.config.editor_events.data_system_url, JSON.stringify( data ) ) ) {
			return;
		}

		fetch( elementor.config.editor_events.data_system_url, {
			body: JSON.stringify( data ),
			method: 'POST',
			credentials: 'omit',
			keepalive: true,
		} ).catch( console.error );
	}
}
