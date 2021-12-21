import { expect, test } from '@playwright/test'
import WpAdminPage from "../../pages/wp-admin-page.mjs";

/**
 * @type {EditorPage}
 */
let editor;

let wpAdmin;

const createTabsWidget = async( editor, targetID = null ) => {
	if ( ! targetID ) {
		targetID = await editor.addElement( { elType: 'container' }, 'document' );
	}

	return await editor.addWidget( 'nested-tabs', targetID );
}

test.describe( 'NestedElementsModule', () => {
	test.beforeEach( async ( { page }, testInfo ) => {
		wpAdmin = new WpAdminPage( page, testInfo );

		await wpAdmin.login();

		await wpAdmin.setExperiments( {
			container: true,
			'nested-elements': true,
		} );

		editor = await wpAdmin.useElementorCleanPost();
	} );


	test.afterAll( async () => {
		await wpAdmin.setExperiments( {
			container: false,
			'nested-elements': false,
		} );
	} );

	test.describe( 'Component: `nested-elements`', () => {
		test.describe( 'Component: `nested-elements/nested-repeater`', () => {

			test.describe( 'Commands', () => {
				test( 'Command: `nested-elements/nested-repeater/select`', async () => {
					// Arrange.
					const indexToSelect = 2,
						widgetId = await createTabsWidget( editor );

					// Act.
					await editor.page.evaluate( ( [ id, index ] ) => {
						return $e.commands.run( 'nested-elements/nested-repeater/select', {
								index,
								container: elementor.getContainer( id )
							}
						);
					}, [ widgetId, indexToSelect ] );

					// Assert, Ensure tab selected.
					const tabTitle = await editor.previewFrame.locator( `:nth-match(:text("Tab #${indexToSelect}"), ${indexToSelect})` );

					await expect( await tabTitle.getAttribute( 'aria-selected' ) ).toBeTruthy();
				} );
			} );

			test.describe( 'Hooks', () => {
				test.describe( 'Data', () => {
					test( 'Hook: `nested-repeater-create-default-children`', async () => {
						// Arrange, Open navigator.
						await editor.openNavigator();

						// Act - Add nested-tabs widget.
						await createTabsWidget( editor );

						// Click #elementor-navigator__toggle-all
						await editor.page.click( '#elementor-navigator__toggle-all' );

						// Assert - Ensure nested-tabs widget has correct `_title`.
						await expect( editor.page.locator( '.elementor-navigator__element__title__text' ) ).toHaveText( [
							'Container',
							'Nested Tabs',
							'Tab #1',
							'Tab #2'
						] );
					} );

					test( 'Hook `nested-repeater-create-container`', async () => {
						// Arrange.
						const widgetId = await createTabsWidget( editor );

						// Act.
						await editor.page.evaluate( ( [ id ] ) => {
							return $e.run( 'document/repeater/insert', {
								container: elementor.getContainer( id ),
								model: {},
								name: 'tabs',
							} );
						}, [ widgetId ] );

						// Assert - Validate new inserted container title.
						await expect( editor.previewFrame.locator( 'text=Tab #3' ).first() ).toBeVisible();
					} );

					test( 'Hook `nested-repeater-remove-container`', async () => {
						// Arrange.
						const widgetId = await createTabsWidget( editor );

						// Act.
						await editor.page.evaluate( ( [ id ] ) => {
							return $e.run( 'document/repeater/remove', {
								container: elementor.getContainer( id ),
								index: 1,
								name: 'tabs',
							} );
						}, [ widgetId ] );

						// Assert.
						await expect( await editor.previewFrame.locator( 'text=Tab #2' ) ).not.toBeVisible()
					} );
				} );
			} );
		} );
	} );
} );
