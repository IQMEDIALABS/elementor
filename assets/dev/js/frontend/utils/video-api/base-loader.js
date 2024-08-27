export default class BaseLoader extends elementorModules.ViewModuleFrontend {
	getDefaultSettings() {
		return {
			isInserted: false,
			selectors: {
				firstScript: 'script:first-of-type',
			},
		};
	}

	getDefaultElements() {
		return {
			firstScript: document.querySelector( this.getSettings( 'selectors.firstScript' ) ),
		};
	}

	insertAPI() {
		const firstScript = this.elements.firstScript,
			newScript = document.createElement( 'script' );

		newScript.src = this.getApiURL();
		firstScript.parentNode?.insertBefore( newScript, firstScript );

		this.setSettings( 'isInserted', true );
	}

	getVideoIDFromURL( url ) {
		const videoIDParts = url.match( this.getURLRegex() );

		return videoIDParts && videoIDParts[ 1 ];
	}

	onApiReady( callback ) {
		if ( ! this.getSettings( 'isInserted' ) ) {
			this.insertAPI();
		}

		if ( this.isApiLoaded() ) {
			callback( this.getApiObject() );
		} else {
			// If not ready check again by timeout..
			setTimeout( () => {
				this.onApiReady( callback );
			}, 350 );
		}
	}

	getAutoplayURL( videoURL ) {
		return videoURL.replace( '&autoplay=0', '' ) + '&autoplay=1';
	}
}
