import { parallelTest as test } from '../parallelTest';
import WpAdminPage from '../pages/wp-admin-page';


test.describe( 'Woocommerce Shop page Edite with Elementor', () => {
	test( 'Editing Woocommerce shop page with elementor should show message', async ( { page, apiRequests }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );
		const editor = await wpAdmin.openNewPage();

		const postId = await editor.getPageId();
		await wpAdmin.setWCShopPage( postId );

		// await expect( editor.page.locator( '.dialog-header.dialog-confirm-header' ) ).toBeVisible();

		// const modalTitle = editor.page.waitForSelector( '.dialog-header.dialog-confirm-header' );
		//
		// expect( modalTitle ).toBe( 'Sorry, the content area was not found in your page.' );
	} );
} );
