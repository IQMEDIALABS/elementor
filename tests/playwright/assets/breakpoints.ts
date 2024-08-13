import { Locator, type Page } from '@playwright/test';
import EditorPage from '../pages/editor-page';
import { Device } from '../types/types';

export default class {
	readonly page: Page;
	constructor( page: Page ) {
		this.page = page;
		// TODO: throw exception if experiment Breakpoints is deactivated.
	}

	static getDeviceLocator( page: Page, device: Device ): Locator {
		// TODO: use the new data-testid attribute
		const baseLocator = page.locator( '[aria-label="Switch Device"]' );
		const locators = {
			mobile: baseLocator.locator( 'button[aria-label="Mobile Portrait (up to 767px)"]' ),
			mobile_extra: baseLocator.locator( 'button[aria-label="Mobile Landscape (up to 880px)"]' ),
			tablet: baseLocator.locator( 'button[aria-label="Tablet Portrait (up to 1024px)"]' ),
			tablet_extra: baseLocator.locator( 'button[aria-label="Tablet Landscape (up to 1200px)"]' ),
			laptop: baseLocator.locator( 'button[aria-label="Laptop (up to 1366px)"]' ),
			desktop: baseLocator.locator( 'button[aria-label="Desktop"]' ),
			widescreen: baseLocator.locator( 'button[aria-label="Widescreen (2400px and up)"]' ),
		};

		return locators[ device ];
	}

	static getAll() {
		return [ 'mobile', 'mobile_extra', 'tablet', 'tablet_extra', 'laptop', 'desktop', 'widescreen' ];
	}

	static getBasic() {
		return [ 'mobile', 'tablet', 'desktop' ];
	}

	async saveOrUpdate( editor: EditorPage, toReload = false ) {
		const hasTopBar: boolean = await editor.hasTopBar();
		if ( hasTopBar ) {
			const saveButton = "//button[text()='Save Changes']";
			if ( await this.page.locator( saveButton ).isEnabled() ) {
				await this.page.locator( saveButton ).click();
			} else {
				await this.page.evaluate( ( selector ) => {
					const button: HTMLElement = document.evaluate( selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE ).singleNodeValue as HTMLElement;
					button.click();
				}, saveButton );
			}
			if ( toReload ) {
				const reloadButton = this.page.locator( 'button', { hasText: 'Reload Now' } );
				await reloadButton.waitFor();
				await reloadButton.click();
			}
		} else {
			await this.page.click( 'text=Update' );
			await this.page.waitForSelector( '#elementor-toast' );
		}
	}

	async addAllBreakpoints( editor: EditorPage, experimentPostId?: string ) {
		await editor.openSiteSettings( 'layout' );
		await editor.openSection( 'section_breakpoints' );
		await this.page.waitForSelector( 'text=Active Breakpoints' );

		const devices = [ 'Mobile Landscape', 'Tablet Landscape', 'Laptop', 'Widescreen' ];

		for ( const device of devices ) {
			if ( await this.page.$( '.select2-selection__e-plus-button' ) ) {
				await this.page.click( '.select2-selection__e-plus-button' );
				await this.page.click( `li:has-text("${ device }")` );
			}
		}

		await this.saveOrUpdate( editor, true );

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

	async resetBreakpoints( editor: EditorPage ) {
		await editor.openSiteSettings( 'layout' );
		await editor.openSection( 'section_breakpoints' );
		await this.page.waitForSelector( 'text=Active Breakpoints' );

		const removeBreakpointButton = '#elementor-kit-panel-content .select2-selection__choice__remove';
		while ( await this.page.locator( removeBreakpointButton ).count() > 0 ) {
			await this.page.click( removeBreakpointButton );
		}
		await this.saveOrUpdate( editor, true );
	}
}
