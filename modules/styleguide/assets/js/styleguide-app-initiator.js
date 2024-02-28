import ReactUtils from 'elementor-utils/react';

( () => {
	let unmountUtil;
	const styleguideBodyClass = 'e-styleguide-shown';

	/**
	 * Add the app into the page.
	 */
	async function mount() {
		const { default: App } = await import( './frontend/app' );

		document.body.classList.add( styleguideBodyClass );

		const { unmount } = ReactUtils.render( <App />, getStyleguideWidget() );
		unmountUtil = unmount;
	}

	/**
	 * Remove the app from the page.
	 */
	function unmount() {
		unmountUtil();
		document.body.classList.remove( styleguideBodyClass );
	}

	/**
	 * Get the Styleguide widget that serves as the App container.
	 * Returns null if the widget does not exist.
	 *
	 * @return {Object|null}
	 */
	function getStyleguideWidget() {
		return document.querySelector( '.dialog-styleguide-message' );
	}

	/**
	 * Listen to an event from the Styleguide e-component to mount or unmount the app.
	 */
	window.addEventListener( 'message', ( event ) => {
		if ( ! event.data?.name?.startsWith( 'elementor/styleguide/preview' ) || ! getStyleguideWidget() ) {
			return;
		}

		switch ( event.data.name ) {
			case 'elementor/styleguide/preview/show':
				mount();
				break;

			case 'elementor/styleguide/preview/hide':
				unmount();
				break;
		}
	} );
} )();
