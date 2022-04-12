import Deprecation from './deprecation';

/* global elementorDevToolsConfig */

export default class Module {
	constructor() {
		this.deprecation = new Deprecation( this );

		this.notifyBackendDeprecations();
	}

	consoleWarn( ...args ) {
		const style = `font-size: 12px; background-image: url("${ elementorDevToolsConfig.urls.assets }images/logo-icon.png"); background-repeat: no-repeat; background-size: contain;`;

		args.unshift( '%c  %c', style, '' );

		console.warn( ...args ); // eslint-disable-line no-console
	}

	notifyBackendDeprecations() {
		// eslint-disable-next-line camelcase
		const notices = elementorDevToolsConfig.deprecation.soft_notices;

		Object.entries( notices ).forEach( ( [ key, notice ] ) => {
			this.deprecation.softDeprecated( key, ...notice );
		} );
	}
}

// Since `elementorDevTools` is used by `elementor-dev-tools` plugin.
// TODO - Remove, after the plugin external is removed.
window.elementorDevToolsModule = new Module();
