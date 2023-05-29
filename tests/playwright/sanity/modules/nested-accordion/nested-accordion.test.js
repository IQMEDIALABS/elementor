import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';
import _path from 'path';

test.describe( 'Nested Accordion @nested-accordion', () => {
	test.describe( 'Nested Accordion experiment inactive', () => {
		test.beforeAll( async ( { browser }, testInfo ) => {
			const page = await browser.newPage();
			const wpAdmin = await new WpAdminPage( page, testInfo );

			await wpAdmin.setExperiments( {
				container: 'active',
				'nested-elements': 'active',
				'nested-accordion': 'inactive',
			} );

			await page.close();
		} );

		test.afterAll( async ( { browser }, testInfo ) => {
			const context = await browser.newContext();
			const page = await context.newPage();
			const wpAdmin = new WpAdminPage( page, testInfo );
			await wpAdmin.setExperiments( {
				'nested-elements': 'inactive',
				container: 'inactive',
			} );

			await page.close();
		} );

		test( 'Nested-accordion should not appear in widgets panel', async ( { page }, testInfo ) => {
			// Arrange
			const wpAdmin = new WpAdminPage( page, testInfo ),
				editor = await wpAdmin.useElementorCleanPost(),
				container = await editor.addElement( { elType: 'container' }, 'document' ),
				frame = editor.getPreviewFrame(),
				accordionWrapper = await frame.locator( '.elementor-accordion' ).first(),
				toggleWrapper = await frame.locator( '.elementor-toggle' ).first();

			await test.step( 'Check that Toggle and Accordion widgets appear when nested accordion experiment is off', async () => {
				// Act
				await editor.addWidget( 'accordion', container );
				await editor.addWidget( 'toggle', container );

				// Assert
				await expect( await accordionWrapper ).toHaveCount( 1 );
				await expect( await toggleWrapper ).toHaveCount( 1 );
			} );
		} );
	} );

	test.describe( 'Nested Accordion experiment is active', () => {
		test.beforeAll( async ( { browser }, testInfo ) => {
			const page = await browser.newPage();
			const wpAdmin = await new WpAdminPage( page, testInfo );

			await wpAdmin.setExperiments( {
				container: 'active',
				'nested-elements': 'active',
				'nested-accordion': 'active',
			} );

			await page.close();
		} );

		test.afterAll( async ( { browser }, testInfo ) => {
			const context = await browser.newContext();
			const page = await context.newPage();
			const wpAdmin = new WpAdminPage( page, testInfo );
			await wpAdmin.setExperiments( {
				'nested-elements': 'inactive',
				container: 'inactive',
				'nested-accordion': 'inactive',
			} );

			await page.close();
		} );

		test( 'General Test', async ( { page }, testInfo ) => {
			const wpAdmin = new WpAdminPage( page, testInfo ),
				editor = await wpAdmin.useElementorCleanPost(),
				container = await editor.addElement( { elType: 'container' }, 'document' ),
				frame = editor.getPreviewFrame(),
				accordionWrapper = await frame.locator( '.elementor-accordion' ).first(),
				toggleWidgetInPanel = await page.locator( 'i.eicon-toggle' ).first(),
				widgetPanelButton = await page.locator( '#elementor-panel-header-add-button .eicon-apps' ),
				widgetSearchBar = '#elementor-panel-elements-search-wrapper input#elementor-panel-elements-search-input',
				nestedAccordionItemTitle = await frame.locator( '.e-n-accordion-item' ),
				nestedAccordionItemContent = nestedAccordionItemTitle.locator( '.e-con' );

			let nestedAccordionID,
				nestedAccordion;

			await test.step( 'Check that Toggle widget does not appear when nested accordion experiment is on', async () => {
				// Act
				await editor.closeNavigatorIfOpen();
				await widgetPanelButton.click();

				await page.waitForSelector( widgetSearchBar );
				await page.locator( widgetSearchBar ).fill( 'toggle' );

				// Assert
				await expect( toggleWidgetInPanel ).toBeHidden();
			} );

			await test.step( 'Check that Nested accordion replaces old accordion widget', async () => {
				// Act
				nestedAccordionID = await editor.addWidget( 'nested-accordion', container );
				nestedAccordion = await editor.selectElement( nestedAccordionID );

				// Assert
				await expect( await nestedAccordion ).toHaveCount( 1 );
				await expect( accordionWrapper ).toHaveCount( 0 );
			} );

			await test.step( 'Count number of items in initial state', async () => {
				// Act
				await expect( nestedAccordionItemTitle ).toHaveCount( 3 );
				await expect( nestedAccordionItemContent ).toHaveCount( 3 );

				// Assert
				await expect( toggleWidgetInPanel ).toBeHidden();
			} );

			await test.step( 'Add an item to the repeater', async () => {
				// Arrange
				const addItemButton = await page.locator( '.elementor-repeater-add' ),
					numberOfTitles = await nestedAccordionItemTitle.count(),
					numberOfContents = await nestedAccordionItemContent.count();

				// Act
				await addItemButton.click();

				// Assert
				await expect( nestedAccordionItemTitle ).toHaveCount( await numberOfTitles + 1 );
				await expect( nestedAccordionItemContent ).toHaveCount( await numberOfContents + 1 );
			} );

			await test.step( 'Remove an item from the repeater', async () => {
				// Arrange
				const deleteItemButton = await page.locator( '.elementor-repeater-row-tool.elementor-repeater-tool-remove .eicon-close' ),
					numberOfTitles = await nestedAccordionItemTitle.count(),
					numberOfContents = await nestedAccordionItemContent.count();

				// Act
				await deleteItemButton.last().click();

				// Assert
				await expect( nestedAccordionItemTitle ).toHaveCount( await numberOfTitles - 1 );
				await expect( nestedAccordionItemContent ).toHaveCount( await numberOfContents - 1 );
			} );
		} );
	} );

	test( 'Nested Accordion Title Text and Title Icons', async ( { browser }, testInfo ) => {
		const page = await browser.newPage(),
			wpAdmin = new WpAdminPage( page, testInfo ),
			editor = await wpAdmin.useElementorCleanPost(),
			filePath = _path.resolve( __dirname, `./templates/nested-accordion-title-and-icons.json` );

		await editor.loadTemplate( filePath, false );
		await editor.waitForElement( { isPublished: false, selector: '.elementor-widget-n-accordion' } );

		await editor.closeNavigatorIfOpen();

		const NestedAccordionWidgetId = '48f02ad',
			frame = editor.getPreviewFrame(),
			nestedAccordion = frame.locator( '.e-n-accordion' ).filter( { hasText: 'One' } ),
			nestedAccordionTitle = frame.locator( 'summary .e-n-accordion-item-title' ).filter( { hasText: 'One' } );

		await test.step( 'Widget Screenshot matches intended design', async () => {
			expect( await nestedAccordion.screenshot( { type: 'jpeg', quality: 100 } ) ).toMatchSnapshot( 'nested-carousel-title-import.jpg' );
		} );

		await test.step( 'Check that the title icon is displayed', async () => {
			// Assert
			await expect( await nestedAccordion.locator( 'i' ).nth( 1 ) ).toBeVisible();
			await expect( await nestedAccordion.locator( 'i' ).nth( 1 ) ).toHaveClass( 'fas fa-plus' );
			await expect( await frame.getByRole( 'group' ).filter( { hasText: 'One' } ).locator( 'i' ).nth( 0 ) ).toBeHidden();
		} );

		await test.step( 'Check that icon changes when Accordion is opened', async () => {
			await nestedAccordionTitle.click( { timeout: 5000 } );
			await expect( await getIcon( nestedAccordion, 0 ) ).toBeVisible();
			await expect( await getIcon( nestedAccordion, 0 ) ).toHaveClass( 'fas fa-minus' );
			await expect( await nestedAccordion.locator( 'i' ).nth( 1 ) ).toBeHidden();
			await nestedAccordionTitle.click( { timeout: 5000 } );
		} );

		await editor.selectElement( NestedAccordionWidgetId );

		await test.step( 'Check title position default start', async () => {
			await editor.selectElement( NestedAccordionWidgetId );
			// Assert
			// Normal = Flex-start
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'normal' );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-align-start-h', { timeout: 5000 } ).click();
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'normal', { timeout: 5000 } );
		} );

		await test.step( 'Check title position end', async () => {
		// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-align-end-h', { timeout: 5000 } ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'flex-end' );
		} );

		await test.step( 'Check title position center', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-h-align-center', { timeout: 5000 } ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'center' );
		} );

		await test.step( 'Check title position justify', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-h-align-stretch', { timeout: 5000 } ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'space-between' );
		} );

		await test.step( 'Check title icon position left', async () => {
			// Assert
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '-1' );
		} );

		await test.step( 'Check title icon position right', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_icon_position .elementor-control-input-wrapper .eicon-h-align-right', { timeout: 5000 } ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '0' );
		} );

		// Mobile
		await editor.selectElement( NestedAccordionWidgetId );
		await page.getByText( 'Desktop Tablet Portrait Mobile Portrait' ).first().click();
		await page.getByRole( 'button', { name: 'Mobile Portrait' } ).first().click();

		await test.step( 'Check that the title icon is displayed', async () => {
			// Assert
			await expect( await getIcon( nestedAccordion, 1 ) ).toBeVisible();
			await expect( await getIcon( nestedAccordion, 1 ) ).toHaveClass( 'fas fa-plus' );

			await expect( await frame.getByRole( 'group' ).filter( { hasText: 'One' } ).locator( 'i' ).nth( 0 ) ).toBeHidden();
		} );

		await test.step( 'Check that icon changes when the mobile Accordion is opened', async () => {
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await nestedAccordionTitle.click( { timeout: 5000 } );
			await expect( await getIcon( nestedAccordion, 0 ) ).toBeVisible();
			await expect( await getIcon( nestedAccordion, 0 ) ).toHaveClass( 'fas fa-minus' );
			await expect( await getIcon( nestedAccordion, 1 ) ).toBeHidden();
			await nestedAccordionTitle.click( { timeout: 5000 } );
		} );

		await test.step( 'Check title position mobile is default start', async () => {
			// Assert
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'normal' );
		} );

		await test.step( 'Check title position mobile is flex-end', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal_mobile .elementor-control-input-wrapper .eicon-align-end-h' ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'flex-end' );
		} );

		await test.step( 'Check title position mobile is center', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal_mobile .elementor-control-input-wrapper .eicon-h-align-center' ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'center' );
		} );

		await test.step( 'Check title position mobile is justify', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal_mobile .elementor-control-input-wrapper .eicon-h-align-stretch' ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'space-between' );
		} );

		await test.step( 'Check title icon position right', async () => {
			// Assert
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '0' );
		} );

		await test.step( 'Check title icon position left', async () => {
			// Act
			await editor.selectElement( NestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_icon_position_mobile .elementor-control-input-wrapper .eicon-h-align-left' ).click();
			// Assert
			await frame.waitForLoadState( 'load', { timeout: 5000 } );
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '-1' );
		} );
	} );
} );

/*
 * Returns the Icon from Nested Accordion Item.
 */
async function getIcon( nestedAccordionItem, iconIndex ) {
	return await nestedAccordionItem.locator( 'i' ).nth( iconIndex );
}
