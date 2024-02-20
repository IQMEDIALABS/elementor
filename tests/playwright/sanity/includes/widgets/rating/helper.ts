import WpAdminPage from '../../../../pages/wp-admin-page';

export async function beforeAll( browser, testInfo, iconExperimentState = 'active' ) {
	const page = await browser.newPage();
	const wpAdmin = new WpAdminPage( page, testInfo );

	await wpAdmin.setExperiments( {
		container: 'active',
		e_font_icon_svg: 'active' === iconExperimentState,
	} );

	await page.close();
}

export async function afterAll( browser, testInfo ) {
	const context = await browser.newContext();
	const page = await context.newPage();
	const wpAdmin = new WpAdminPage( page, testInfo );
	await wpAdmin.setExperiments( {
		container: 'inactive',
		e_font_icon_svg: 'inactive',
	} );

	await page.close();
}
