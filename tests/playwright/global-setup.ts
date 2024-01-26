import { chromium, request, type FullConfig } from '@playwright/test';
import { cleanUpTestPages, createApiContext, createDefaultMedia, deleteDefaultMedia, loginApi } from './assets/api-requests';

module.exports = async ( config: FullConfig ) => {
	const { baseURL, headless } = config.projects[ 0 ].use;

	const browser = await chromium.launch( { headless } );
	const context = await browser.newContext();
	const page = await context.newPage();
	const cookies = await loginApi( process.env.USERNAME || 'admin', process.env.PASSWORD || 'password', 'http://localhost:8888/wp-login.php' );
	await context.addCookies( cookies );
	await page.goto( `${ baseURL }/wp-admin` );
	const storageState = await page.context().storageState( { path: './storageState.json' } );

	// Save the nonce and storage state in environment variables, to allow use them when creating the API context.
	// @ts-ignore
	process.env.WP_REST_NONCE = await page.evaluate( () => window.wpApiSettings.nonce );
	process.env.STORAGE_STATE = JSON.stringify( storageState );
	process.env.BASE_URL = baseURL;

	const imageIds = [];
	const image1 = {
		title: 'image1',
		extension: 'jpg',
	};
	const image2 = {
		title: 'image2',
		extension: 'jpg',
	};

	const apiContext = await createApiContext( request, {
		storageStateObject: storageState,
		wpRESTNonce: process.env.WP_REST_NONCE,
		baseURL,
	} );

	imageIds.push( await createDefaultMedia( apiContext, image1 ) );
	imageIds.push( await createDefaultMedia( apiContext, image2 ) );

	await browser.close();

	// Teardown function.
	return async () => {
		await deleteDefaultMedia( apiContext, imageIds );
		await cleanUpTestPages( apiContext );
	};
};
