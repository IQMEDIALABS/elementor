import { type Page } from '@playwright/test';

export default class {
	readonly page: Page;
	constructor( page: Page ) {
		this.page = page;
		// TODO: throw exception if experiment Breakpoints is deactivated.
	}

	static getAll() {
		return [ 'mobile', 'mobile_extra', 'tablet', 'tablet_extra', 'laptop', 'desktop', 'widescreen' ];
	}

	static getBasic() {
		return [ 'mobile', 'tablet', 'desktop' ];
	}

	async addAllBreakpoints( experimentPostId?: string ) {
		await this.page.click( '#elementor-panel-footer-responsive' );
		await this.page.click( '#e-responsive-bar__settings-button' );
		await this.page.waitForSelector( 'text=Active Breakpoints' );

		const devices = [ 'Mobile Landscape', 'Tablet Landscape', 'Laptop', 'Widescreen' ];

		for ( const device of devices ) {
			if ( await this.page.$( '.select2-selection__e-plus-button' ) ) {
				await this.page.click( '.select2-selection__e-plus-button' );
				await this.page.click( `li:has-text("${ device }")` );
			}
		}

		await this.page.click( 'text=Update' );
		await this.page.waitForSelector( '#elementor-toast' );

		if ( experimentPostId ) {
			await this.page.goto( `/wp-admin/post.php?post=${ experimentPostId }&action=elementor` );
		} else {
			await this.page.reload();

			if ( await this.page.$( '#elementor-panel-header-kit-close' ) ) {
				await this.page.locator( '#elementor-panel-header-kit-close' ).click( { timeout: 30000 } );
			}
		}

		await this.page.waitForSelector( '#elementor-editor-wrapper' );
	}

	async resetBreakpoints() {
		await this.page.click( '#elementor-panel-footer-responsive' );
		await this.page.click( '#e-responsive-bar__settings-button' );
		await this.page.waitForSelector( 'text=Active Breakpoints' );

		const removeBreakpointButton = '#elementor-kit-panel-content .select2-selection__choice__remove';
		while ( await this.page.$( removeBreakpointButton ) ) {
			await this.page.click( removeBreakpointButton );
		}

		await this.page.click( 'text=Update' );
		await this.page.waitForSelector( '#elementor-toast' );
	}
}
