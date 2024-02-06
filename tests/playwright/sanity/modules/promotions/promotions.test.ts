import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';
import { widgetControlPromotionModalScreenshotTest } from './helper';

test.describe( 'Promotion tests @promotions', () => {
	test( 'Menu Items Promotions - screenshots', async ( { page }, testInfo ) => {
		const wpAdminPage = new WpAdminPage( page, testInfo ),
			promotionContainer = '.e-feature-promotion';

		await wpAdminPage.login();

		await test.step( 'Free to Pro - Submissions', async () => {
			await wpAdminPage.promotionPageScreenshotTest( promotionContainer, 'e-form-submissions', 'submissions-menu-item-desktop' );
		} );

		await test.step( 'Free to Pro - Custom Icons', async () => {
			await wpAdminPage.promotionPageScreenshotTest( promotionContainer, 'elementor_custom_icons', 'custom-icons-menu-item-desktop' );
		} );

		await test.step( 'Free to Pro - Custom Fonts', async () => {
			await wpAdminPage.promotionPageScreenshotTest( promotionContainer, 'elementor_custom_fonts', 'custom-fonts-menu-item-desktop' );
		} );

		await test.step( 'Free to Pro - Custom Code', async () => {
			await wpAdminPage.promotionPageScreenshotTest( promotionContainer, 'elementor_custom_code', 'custom-code-menu-item-desktop' );
		} );
	} );

	test( 'Modal Promotions screenshots', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo );
		const editor = await wpAdmin.openNewPage(),
			container = await editor.addElement( { elType: 'container' }, 'document' );

		await editor.addWidget( 'heading', container );

		await editor.activatePanelTab( 'advanced' );
		await page.locator( '.elementor-control-section_effects' ).click();

		await test.step( 'Motion Effects - promotion controls screenshots', async () => {
			const promotionControls = [ 'elementor-control-scrolling_effects_pro', 'elementor-control-mouse_effects_pro', 'elementor-control-sticky_pro' ];

			for ( const control of promotionControls ) {
				const controlContainer = page.locator( `.${ control }` );
				await expect.soft( controlContainer ).toHaveScreenshot( `${ control }.png` );
			}
		} );

		await test.step( 'Free to Pro - Control modals screenshot tests', async () => {
			const promotionControls = [ 'scrolling-effects', 'mouse-effects', 'sticky-effects' ];
			for ( const effect of promotionControls ) {
				await widgetControlPromotionModalScreenshotTest( page, effect );
			}
		} );
	} );
} );
