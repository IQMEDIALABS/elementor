export default class BasePage {
	/**
	 * @param {import('@playwright/test').Page} page
	 * @param {import('@playwright/test').TestInfo} testInfo
	 */
	constructor( page, testInfo ) {
		if ( ! page || ! testInfo ) {
			throw new Error( 'Page and TestInfo must be provided' );
		}

		/**
		 * @type {import('@playwright/test').Page}
		 */
		this.page = page;

		/**
		 * @type {import('@playwright/test').TestInfo}
		 */
		this.testInfo = testInfo;

		this.config = this.testInfo.config.projects[ 0 ].use;

		this.page = new Proxy( this.page, {
			get: ( target, key ) => {
				if ( key === 'goto' ) {
					return ( path ) => {
						return page.goto( this.config.baseURL + path );
					}
				} else if ( key === 'waitForNavigation' ) {
					return ( args ) => {
						if ( ! args ) {
							return page.waitForNavigation();
						}

						return page.waitForNavigation( this.config.baseURL + args.url );
					}
				}

				return target[ key ];
			},
		} );
	}
}
