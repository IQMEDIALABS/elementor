import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';

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
				await expect( nestedAccordionItemTitle ).toHaveCount( numberOfTitles + 1 );
				await expect( nestedAccordionItemContent ).toHaveCount( numberOfContents + 1 );
			} );

			await test.step( 'Remove an item from the repeater', async () => {
				// Arrange
				const deleteItemButton = await page.locator( '.elementor-repeater-row-tool.elementor-repeater-tool-remove .eicon-close' ),
					numberOfTitles = await nestedAccordionItemTitle.count(),
					numberOfContents = await nestedAccordionItemContent.count();

				// Act
				await deleteItemButton.last().click();

				// Assert
				await expect( nestedAccordionItemTitle ).toHaveCount( numberOfTitles - 1 );
				await expect( nestedAccordionItemContent ).toHaveCount( numberOfContents - 1 );
			} );
		} );
	} );
} );

test.describe( 'Nested Accordion Title Text and Title Icons', () => {
	test.beforeAll( async ( { browser }, testInfo ) => {
		const page = await browser.newPage(),
			wpAdmin = new WpAdminPage( page, testInfo );

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
		} );

		await page.close();
	} );

	test( 'Nested Accordion Title Text and Title Icons', async ( { browser }, testInfo ) => {
		// Act
		const page = await browser.newPage(),
			wpAdmin = new WpAdminPage( page, testInfo ),
			editor = await wpAdmin.useElementorCleanPost();

		await editor.loadJsonPageTemplate( __dirname, 'nested-accordion-title-and-icons', '.elementor-widget-n-accordion' );

		await editor.closeNavigatorIfOpen();

		const nestedAccordionWidgetId = '48f02ad',
			frame = editor.getPreviewFrame(),
			nestedAccordion = frame.locator( '.e-n-accordion' ).filter( { hasText: 'One' } ),
			nestedAccordionTitle = frame.locator( 'summary' ).first().filter( { hasText: 'One' } );

		await test.step( 'Widget Screenshot matches intended design', async () => {
			expect( await frame.locator( '.e-n-accordion' ).first().screenshot( { type: 'jpeg', quality: 90 } ) ).toMatchSnapshot( 'nested-carousel-title-and-icons.jpg' );
		} );

		await test.step( 'Check that the title icon is displayed', async () => {
			// Assert
			await expect( await nestedAccordion.locator( 'i' ).nth( 1 ) ).toBeVisible();
			await expect( await nestedAccordion.locator( 'i' ).nth( 1 ) ).toHaveClass( 'fas fa-plus' );
			await expect( await frame.getByRole( 'group' ).filter( { hasText: 'One' } ).locator( 'i' ).nth( 0 ) ).toBeHidden();
		} );

		await test.step( 'Check that icon changes when Accordion is opened', async () => {
			await frame.waitForLoadState( 'load', { timeout: 7000 } );
			await nestedAccordionTitle.click( { timeout: 5000 } );
			await expect( await getIcon( nestedAccordion, 0 ) ).toBeVisible();
			await expect( await getIcon( nestedAccordion, 0 ) ).toHaveClass( 'fas fa-minus' );
			await expect( await nestedAccordion.locator( 'i' ).nth( 1 ) ).toBeHidden();
			await nestedAccordionTitle.click( { timeout: 5000 } );
		} );

		await editor.selectElement( nestedAccordionWidgetId );

		await test.step( 'Check title position default start', async () => {
			await editor.selectElement( nestedAccordionWidgetId );
			// Assert
			// Normal = Flex-start
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'normal' );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-align-start-h' ).click();
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'normal' );
		} );

		await test.step( 'Check title position end', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-align-end-h' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'flex-end' );
		} );

		await test.step( 'Check title position center', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-h-align-center' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'center' );
		} );

		await test.step( 'Check title position justify', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal .elementor-control-input-wrapper .eicon-h-align-stretch' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'space-between' );
		} );

		await test.step( 'Check title icon position left', async () => {
			// Assert
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '-1' );
		} );

		await test.step( 'Check title icon position right', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_icon_position .elementor-control-input-wrapper .eicon-h-align-right' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '0' );
		} );

		await test.step( 'Change to mobile mode', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.getByText( 'Desktop Tablet Portrait Mobile Portrait' ).first().click();
			await page.getByRole( 'button', { name: 'Mobile Portrait' } ).first().click();
		} );

		await test.step( 'Mobile -Check that the title icon is displayed', async () => {
			// Assert
			await expect( await getIcon( nestedAccordion, 1 ) ).toBeVisible();
			await expect( await getIcon( nestedAccordion, 1 ) ).toHaveClass( 'fas fa-plus' );

			await expect( await frame.getByRole( 'group' ).filter( { hasText: 'One' } ).locator( 'i' ).nth( 0 ) ).toBeHidden();
		} );

		await test.step( 'Mobile - Check that icon changes when the mobile Accordion is opened', async () => {
			await frame.waitForLoadState( 'load' );
			await nestedAccordionTitle.click();
			await expect( await getIcon( nestedAccordion, 0 ) ).toBeVisible();
			await expect( await getIcon( nestedAccordion, 0 ) ).toHaveClass( 'fas fa-minus' );
			await expect( await getIcon( nestedAccordion, 1 ) ).toBeHidden();
			await nestedAccordionTitle.click();
		} );

		await test.step( 'Mobile - Check title position mobile is default start', async () => {
			// Assert
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'normal' );
		} );

		await test.step( 'Mobile - Check title position mobile is flex-end', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal_mobile .elementor-control-input-wrapper .eicon-align-end-h' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'flex-end' );
		} );

		await test.step( 'Mobile - Check title position mobile is center', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal_mobile .elementor-control-input-wrapper .eicon-h-align-center' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'center' );
		} );

		await test.step( 'Mobile - Check title position mobile is justify', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_position_horizontal_mobile .elementor-control-input-wrapper .eicon-h-align-stretch' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
			await expect( nestedAccordionTitle ).toHaveCSS( 'justify-content', 'space-between' );
		} );

		await test.step( 'Mobile - Check title icon position right', async () => {
			// Assert
			await expect( nestedAccordionTitle.locator( '.e-n-accordion-item-title-icon' ) ).toHaveCSS( 'order', '0' );
		} );

		await test.step( 'Mobile - Check title icon position left', async () => {
			// Act
			await editor.selectElement( nestedAccordionWidgetId );
			await page.locator( '.elementor-control-accordion_item_title_icon_position_mobile .elementor-control-input-wrapper .eicon-h-align-left' ).click();
			// Assert
			await frame.waitForLoadState( 'load' );
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
