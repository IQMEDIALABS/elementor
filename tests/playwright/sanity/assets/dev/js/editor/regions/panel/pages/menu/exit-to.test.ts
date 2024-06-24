import { expect } from '@playwright/test';
import { parallelTest as test } from '../../../../../../../../../parallelTest';
import WpAdminPage from '../../../../../../../../../pages/wp-admin-page';

test( 'Exit to user preference sanity test', async ( { page, apiRequests }, testInfo ) => {
	const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );
	const editor = await wpAdmin.openNewPage();
	const hasTopBar = await editor.hasTopBar();
	let exitHref = '';

	if ( hasTopBar ) {
		// Exit to `dashboard`
		await editor.openUserPreferencesPanel();
		await editor.setSelectControlValue( 'exit_to', 'dashboard' );
		await editor.clickTopBarItem( 'Elementor Logo' );
		await page.waitForTimeout( 100 );
		exitHref = await page.locator( 'body a', { hasText: 'Exit to WordPress' } ).getAttribute( 'href' );
		await page.press( 'body', 'Escape' );
		expect( exitHref ).toContain( '/wp-admin/' );

		// Exit to `this_post`
		await editor.openUserPreferencesPanel();
		await editor.setSelectControlValue( 'exit_to', 'this_post' );
		await editor.clickTopBarItem( 'Elementor Logo' );
		await page.waitForTimeout( 100 );
		exitHref = await page.locator( 'body a', { hasText: 'Exit to WordPress' } ).getAttribute( 'href' );
		await page.press( 'body', 'Escape' );
		expect( exitHref ).toContain( '/wp-admin/post.php?post=' );

		// Exit to `all_posts`
		await editor.openUserPreferencesPanel();
		await editor.setSelectControlValue( 'exit_to', 'all_posts' );
		await editor.clickTopBarItem( 'Elementor Logo' );
		await page.waitForTimeout( 100 );
		exitHref = await page.locator( 'body a', { hasText: 'Exit to WordPress' } ).getAttribute( 'href' );
		await page.press( 'body', 'Escape' );
		expect( exitHref ).toContain( '/wp-admin/edit.php?post_type=' );
	} else {
		await editor.openMenuPanel();
		await editor.page.click( 'text=Exit' );
		await editor.page.click( 'a:has-text("User Preferences")' );
		await editor.openMenuPanel();
		const exit = page.locator( '.elementor-panel-menu-item-exit >> a' );

		// Exit to `dashboard`
		await editor.page.click( '.elementor-panel-menu-item-editor-preferences' );
		await editor.setSelectControlValue( 'exit_to', 'dashboard' );
		await editor.openMenuPanel();
		exitHref = await exit.getAttribute( 'href' );
		expect( exitHref ).toContain( '/wp-admin/' );

		// Exit to `this_post`
		await editor.page.click( '.elementor-panel-menu-item-editor-preferences' );
		await editor.setSelectControlValue( 'exit_to', 'this_post' );
		await editor.openMenuPanel();
		exitHref = await exit.getAttribute( 'href' );
		expect( exitHref ).toContain( '/wp-admin/post.php?post=' );

		// Exit to `all_posts`
		await editor.page.click( '.elementor-panel-menu-item-editor-preferences' );
		await editor.setSelectControlValue( 'exit_to', 'all_posts' );
		await editor.openMenuPanel();
		exitHref = await exit.getAttribute( 'href' );
		expect( exitHref ).toContain( '/wp-admin/edit.php?post_type=' );
	}
} );
