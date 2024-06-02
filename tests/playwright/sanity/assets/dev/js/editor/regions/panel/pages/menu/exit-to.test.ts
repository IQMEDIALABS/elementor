import { test, expect } from '@playwright/test';
import EditorSelectors from '../../../../../../../../../selectors/editor-selectors';
import WpAdminPage from '../../../../../../../../../pages/wp-admin-page';

test( 'Exit to user preference sanity test', async ( { page }, testInfo ) => {
	const wpAdmin = new WpAdminPage( page, testInfo );
	const editor = await wpAdmin.openNewPage();

	// Exit to `dashboard`
	await editor.openUserPreferencesPanel();
	await editor.setSelectControlValue( 'exit_to', 'dashboard' );
	await editor.page.locator( EditorSelectors.topBar.wrapper ).getByRole( 'button', { name: 'Elementor Logo' } ).click();
	await editor.page.waitForTimeout( 500 );
	const exit1 = await editor.page.locator( 'body a', { hasText: 'Exit to WordPress' } ).getAttribute( 'href' );
	await page.press( 'body', 'Escape' );
	expect( exit1 ).toContain( '/wp-admin/' );

	// Exit to `this_post`
	await editor.openUserPreferencesPanel();
	await editor.setSelectControlValue( 'exit_to', 'this_post' );
	await editor.page.locator( EditorSelectors.topBar.wrapper ).getByRole( 'button', { name: 'Elementor Logo' } ).click();
	await editor.page.waitForTimeout( 500 );
	const exit2 = await editor.page.locator( 'body a', { hasText: 'Exit to WordPress' } ).getAttribute( 'href' );
	await page.press( 'body', 'Escape' );
	expect( exit2 ).toContain( '/wp-admin/post.php?post=' );

	// Exit to `all_posts`
	await editor.openUserPreferencesPanel();
	await editor.setSelectControlValue( 'exit_to', 'all_posts' );
	await editor.page.locator( EditorSelectors.topBar.wrapper ).getByRole( 'button', { name: 'Elementor Logo' } ).click();
	await editor.page.waitForTimeout( 500 );
	const exit3 = await editor.page.locator( 'body a', { hasText: 'Exit to WordPress' } ).getAttribute( 'href' );
	await page.press( 'body', 'Escape' );
	expect( exit3 ).toContain( '/wp-admin/edit.php?post_type=' );
} );
