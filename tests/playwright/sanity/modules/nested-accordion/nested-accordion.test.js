import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';
import EditorPage from '../../../pages/editor-page';

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
				widgetPanelButton.click();

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
				addItemButton.click();

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
				deleteItemButton.last().click();

				// Assert
				await expect( nestedAccordionItemTitle ).toHaveCount( await numberOfTitles - 1 );
				await expect( nestedAccordionItemContent ).toHaveCount( await numberOfContents - 1 );
			} );

			await test.step( 'Check default state behaviour', async () => {
				// Check default state -> first item is open
				await expect( nestedAccordionItemTitle.first() ).toHaveAttribute( 'open', 'true' );

				const allItems = await nestedAccordionItemTitle.all(),
					allItemExceptFirst = allItems.slice( 1 );

				for ( const item of allItemExceptFirst ) {
					await expect( item ).not.toHaveAttribute( 'open', '' );
				}

				// Check all collapsed state -> all items are closed
				await editor.openSection( 'section_interactions' );
				await editor.setSelectControlValue( 'default_state', 'all_collapsed' );

				for ( const item of allItems ) {
					await expect( item ).not.toHaveAttribute( 'open', '' );
				}

				// Check manual select of first expand -> first item is open
				await editor.setSelectControlValue( 'default_state', 'expanded' );
				await expect( nestedAccordionItemTitle.first() ).toHaveAttribute( 'open', 'true' );

				for ( const item of allItemExceptFirst ) {
					await expect( item ).not.toHaveAttribute( 'open', 'true' );
				}
			} );
		} );

		test( 'Nested Accordion animation', async ( { page }, testInfo ) => {
			const wpAdmin = new WpAdminPage( page, testInfo ),
				editor = await wpAdmin.useElementorCleanPost(),
				container = await editor.addElement( { elType: 'container' }, 'document' ),
				frame = editor.getPreviewFrame(),
				nestedAccordionID = await editor.addWidget( 'nested-accordion', container ),
				animationDuration = 500;

			await editor.closeNavigatorIfOpen();
			await editor.selectElement( nestedAccordionID );

			await test.step( 'Check closing animation', async () => {
				const itemVisibilityBeforeAnimation = await frame.isVisible( '.e-n-accordion-item:first-child > .e-con' );

				expect( itemVisibilityBeforeAnimation ).toEqual( true );

				await frame.locator( '.e-n-accordion-item:first-child > .e-n-accordion-item-title' ).click();

				// Wait for the closing animation to complete
				await page.waitForTimeout( animationDuration );

				// Check the computed height
				const maxHeightAfterClose = await frame.locator( '.e-n-accordion-item:first-child > .e-con' ).evaluate( ( element ) =>
					window.getComputedStyle( element ).getPropertyValue( 'height' ),
				);

				expect( maxHeightAfterClose ).toEqual( '0px' );
			} );

			await test.step( 'Check open animation', async () => {
				const itemVisibilityBeforeAnimation = await frame.isVisible( '.e-n-accordion-item:first-child > .e-con' );

				expect( itemVisibilityBeforeAnimation ).toEqual( false );

				await frame.locator( '.e-n-accordion-item:first-child > .e-n-accordion-item-title' ).click();

				// Wait for the open animation to complete
				await page.waitForTimeout( animationDuration );

				// Check the computed height
				const maxHeightAfterOpen = await frame.locator( '.e-n-accordion-item:first-child > .e-con' ).evaluate( ( element ) =>
					window.getComputedStyle( element ).getPropertyValue( 'height' ),
				);

				expect( maxHeightAfterOpen ).not.toEqual( '0px' );
			} );
		} );
	} );
} );
