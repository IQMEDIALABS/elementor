import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';
const { expectScreenshotToMatchLocator } = require( './helper' );

test.describe( 'Nested Accordion experiment inactive @nested-accordion', () => {
	test.beforeAll( async ( { browser }, testInfo ) => {
		const page = await browser.newPage();
		const wpAdmin = await new WpAdminPage( page, testInfo );

		await wpAdmin.setExperiments( {
			container: 'inactive',
			'nested-elements': 'inactive',
		} );

		await page.close();
	} );

	test.afterAll( async ( { browser }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo );
		await wpAdmin.setExperiments( {
			'nested-elements': 'active',
			container: 'active',
		} );

		await page.close();
	} );

	test( 'Nested-accordion should not appear in widgets panel', async ( { page }, testInfo ) => {
		// Arrange
		const wpAdmin = new WpAdminPage( page, testInfo ),
			editor = await wpAdmin.openNewPage(),
			container = await editor.addElement( { elType: 'container' }, 'document' ),
			frame = editor.getPreviewFrame(),
			accordionWrapper = await frame.locator( '.elementor-accordion' ).first(),
			toggleWrapper = await frame.locator( '.elementor-toggle' ).first();

		await test.step( 'Check that Toggle and Accordion widgets appear when nested accordion experiment is off', async () => {
			// Act
			await editor.addWidget( 'accordion', container );
			await editor.addWidget( 'toggle', container );

			// Assert
			await expect.soft( await accordionWrapper ).toHaveCount( 1 );
			await expect.soft( await toggleWrapper ).toHaveCount( 1 );
		} );

		test( 'Header style tests new', async ( { page }, testInfo ) => {
			const wpAdmin = new WpAdminPage( page, testInfo ),
				editor = await wpAdmin.openNewPage(),
				container = await editor.addElement( { elType: 'container' }, 'document' ),
				frame = editor.getPreviewFrame(),
				nestedAccordionItem = await frame.locator( '.e-n-accordion-item' ),
				nestedAccordionItemText = await frame.locator( '.e-n-accordion-item-title-text' ),
				nestedAccordionItemFrontText = await page.locator( '.e-n-accordion-item-title-text' );

			await editor.closeNavigatorIfOpen();
			const nestedAccordionID = await editor.addWidget( 'nested-accordion', container );
			const nestedAccordion = await editor.selectElement( nestedAccordionID );
			await editor.activatePanelTab( 'style' );
			await editor.openSection( 'section_header_style' );

			await test.step( 'Editor', async () => {
				await test.step( 'Add stroke and text-shadow styling to header', async () => {
					// Act
					await editor.setShadowControl( 'title-normal-text-shadow', 'text' );
					await editor.setTextStokeControl( 'title-normal-stroke', 'text', 2, colors.red.hex );

					await editor.selectStateTab( 'header_title_color_style', 'hover' );

					await editor.setShadowControl( 'title-hover-text-shadow', 'text' );
					await editor.setTextStokeControl( 'title-hover-stroke', 'text', 5, colors.blue.hex );

					await editor.selectStateTab( 'header_title_color_style', 'active' );

					await editor.setShadowControl( 'title-active-text-shadow', 'text' );
					await editor.setTextStokeControl( 'title-active-stroke', 'text', 1, colors.orange.hex );

					// Assert
					await expect.soft( await nestedAccordion.screenshot( { type: 'png' } ) ).toMatchSnapshot( 'nested-accordion-stroke-and-text-shadow.png' );
				} );

				await test.step( 'Test stroke and text-shadow Hover styling', async () => {
					nestedAccordionItem.nth( 1 ).hover();
					await expect.soft( nestedAccordionItemText.nth( 1 ) ).toHaveCSS( 'text-shadow', 'rgba(0, 0, 0, 0.3) 0px 0px 10px' );
					await expect.soft( nestedAccordionItemText.nth( 1 ) ).toHaveCSS( 'stroke', colors.blue.rgb );
					await expect.soft( nestedAccordionItemText.nth( 1 ) ).toHaveCSS( 'stroke-width', '5px' );
				} );
			} );

			await test.step( 'Frontend', async () => {
				await test.step( 'Test stroke and text-shadow styling', async () => {
					// Act
					await editor.publishAndViewPage();
					// Assert
					await expect.soft( await page.locator( '.elementor-widget-n-accordion' ).screenshot( { type: 'png' } ) ).toMatchSnapshot( 'nested-accordion-stroke-and-text-shadow-front.png' );
				} );

				await test.step( 'Test stroke and text-shadow Hover styling', async () => {
					// Act
					await page.locator( '.e-n-accordion-item' ).nth( 1 ).hover();

					// Assert
					await expect.soft( nestedAccordionItemFrontText.nth( 1 ) ).toHaveCSS( 'text-shadow', 'rgba(0, 0, 0, 0.3) 0px 0px 10px' );
					await expect.soft( nestedAccordionItemFrontText.nth( 1 ) ).toHaveCSS( 'stroke', colors.blue.rgb );
					await expect.soft( nestedAccordionItemFrontText.nth( 1 ) ).toHaveCSS( 'stroke-width', '5px' );
				} );
			} );
		} );
	} );
} );

test.describe( 'Nested Accordion experiment is active @nested-accordion', () => {
	test.beforeAll( async ( { browser }, testInfo ) => {
		const page = await browser.newPage();
		const wpAdmin = await new WpAdminPage( page, testInfo );

		await wpAdmin.setExperiments( {
			container: 'active',
			'nested-elements': 'active',
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

	test( 'General Test', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo ),
			editor = await wpAdmin.openNewPage(),
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
			await expect.soft( toggleWidgetInPanel ).toBeHidden();
		} );

		await test.step( 'Check that Nested accordion replaces old accordion widget', async () => {
			// Act
			nestedAccordionID = await editor.addWidget( 'nested-accordion', container );
			nestedAccordion = await editor.selectElement( nestedAccordionID );

			// Assert
			await expect.soft( await nestedAccordion ).toHaveCount( 1 );
			await expect.soft( accordionWrapper ).toHaveCount( 0 );
		} );

		await test.step( 'Count number of items in initial state', async () => {
			// Act
			await expect.soft( nestedAccordionItemTitle ).toHaveCount( 3 );
			await expect.soft( nestedAccordionItemContent ).toHaveCount( 3 );

			// Assert
			await expect.soft( toggleWidgetInPanel ).toBeHidden();
		} );

		await test.step( 'Add an item to the repeater', async () => {
			// Arrange
			const addItemButton = await page.locator( '.elementor-repeater-add' ),
				numberOfTitles = await nestedAccordionItemTitle.count(),
				numberOfContents = await nestedAccordionItemContent.count();

			// Act
			await addItemButton.click();

			// Assert
			await expect.soft( nestedAccordionItemTitle ).toHaveCount( numberOfTitles + 1 );
			await expect.soft( nestedAccordionItemContent ).toHaveCount( numberOfContents + 1 );
		} );

		await test.step( 'Remove an item from the repeater', async () => {
			// Arrange
			const deleteItemButton = await page.locator( '.elementor-repeater-row-tool.elementor-repeater-tool-remove .eicon-close' ),
				numberOfTitles = await nestedAccordionItemTitle.count(),
				numberOfContents = await nestedAccordionItemContent.count();

			// Act
			await deleteItemButton.last().click();

			// Assert
			await expect.soft( nestedAccordionItemTitle ).toHaveCount( numberOfTitles - 1 );
			await expect.soft( nestedAccordionItemContent ).toHaveCount( numberOfContents - 1 );
		} );

		await test.step( 'Duplicate an item to the repeater', async () => {
			// Arrange
			const duplicateButton = await page.locator( '.elementor-repeater-tool-duplicate .eicon-copy' ).first(),
				numberOfTitles = await nestedAccordionItemTitle.count(),
				numberOfContents = await nestedAccordionItemContent.count();

			// Act
			await duplicateButton.click();

			// Assert
			await expect.soft( nestedAccordionItemTitle ).toHaveCount( numberOfTitles + 1 );
			await expect.soft( nestedAccordionItemContent ).toHaveCount( numberOfContents + 1 );
		} );

		await test.step( 'Check default state behaviour', async () => {
			const allItems = await nestedAccordionItemTitle.all(),
				allItemsExceptFirst = allItems.slice( 1 );

			await test.step( 'Check default state -> first item is open', async () => {
				await expect.soft( nestedAccordionItemTitle.first() ).toHaveAttribute( 'open', 'true' );

				for ( const item of allItemsExceptFirst ) {
					await expect.soft( item ).not.toHaveAttribute( 'open', '' );
				}
			} );

			await test.step( 'Verify that all items are closed.', async () => {
				await editor.openSection( 'section_interactions' );
				await editor.setSelectControlValue( 'default_state', 'all_collapsed' );

				for ( const item of allItems ) {
					await expect.soft( item ).not.toHaveAttribute( 'open', '' );
				}
			} );

			await test.step( 'Check manual select of first expand -> first item is open', async () => {
				await editor.setSelectControlValue( 'default_state', 'expanded' );
				await expect.soft( nestedAccordionItemTitle.first() ).toHaveAttribute( 'open', 'true' );

				for ( const item of allItemsExceptFirst ) {
					await expect.soft( item ).not.toHaveAttribute( 'open', 'true' );
				}
			} );

			await test.step( 'Check that multiple items can be open', async () => {
				await editor.setSelectControlValue( 'max_items_expended', 'multiple' );

				for ( const item of allItemsExceptFirst ) {
					await item.click();
				}

				for ( const item of allItemsExceptFirst ) {
					await expect.soft( item ).not.toHaveAttribute( 'open', 'true' );
				}
			} );

			await editor.setSelectControlValue( 'max_items_expended', 'one' );
		} );
	} );

	test( 'Nested Accordion Visual Regression Test', async ( { browser }, testInfo ) => {
		// Act
		const page = await browser.newPage(),
			wpAdmin = new WpAdminPage( page, testInfo ),
			editor = await wpAdmin.openNewPage(),
			frame = editor.getPreviewFrame();

		await editor.loadJsonPageTemplate( __dirname, 'nested-accordion-title-and-icons', '.elementor-widget-n-accordion' );
		await editor.closeNavigatorIfOpen();

		await test.step( 'Widget Editor Screenshot matches intended design', async () => {
			await expectScreenshotToMatchLocator( `nested-accordion-title-and-icons.png`, frame.locator( '.e-n-accordion' ).first() );
		} );

		await test.step( 'Widget FrontEnd Screenshot matches intended design', async () => {
			await editor.publishAndViewPage();
			await expectScreenshotToMatchLocator( `nested-accordion-title-and-icons-fe.png`, page.locator( '.e-n-accordion' ).first() );
		} );
	} );
} );
