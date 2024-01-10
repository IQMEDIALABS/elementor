import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';

test.describe( 'AI @ai', () => {
	test( 'AI Button', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo );
		const editor = await wpAdmin.openNewPage();

		await test.step( 'Textarea control', async () => {
			await editor.addWidget( 'heading' );
			// Fix me here
			await expect( page.locator( '.1elementor-control-title.elementor-control-type-textarea .e-ai-button' ) ).toHaveCount( 1 );
		} );

		await test.step( 'Wysiwyg control', async () => {
			await editor.addWidget( 'text-editor' );

			await expect( page.locator( '.elementor-control-editor.elementor-control-type-wysiwyg .e-ai-button' ) ).toHaveCount( 1 );
		} );

		await test.step( 'Media control', async () => {
			await editor.addWidget( 'image' );

			await expect( page.locator( '.elementor-control-image.elementor-control-type-media .e-ai-button' ) ).toHaveCount( 1 );
		} );

		await test.step( 'Media control', async () => {
			await editor.addWidget( 'image' );

			await editor.activatePanelTab( 'advanced' );
			await editor.openSection( '_section_background' );
			await page.locator( '.elementor-control-_background_background .eicon-paint-brush' ).click();

			await expect( page.locator( '.elementor-control-_background_image.elementor-control-type-media .e-ai-button' ) ).toHaveCount( 1 );
		} );
	} );
} );
