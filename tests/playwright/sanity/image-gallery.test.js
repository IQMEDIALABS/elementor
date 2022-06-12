const { test, expect } = require( '@playwright/test' );
const WpAdminPage = require( '../pages/wp-admin-page.js' );

test.only( 'Image Carousel', async ( { page }, testInfo ) => {
	// Arrange.
	const wpAdmin = new WpAdminPage( page, testInfo ),
		editor = await wpAdmin.useElementorCleanPost();

  // Close Navigator
  await page.click( '#elementor-navigator__close' );

	// Act.
	await editor.addWidget( 'image-gallery' );

  await page.locator( '[aria-label="Add Images"]' ).click();

  // Open Media Library
  await page.click( 'text=Media Library' );

  // Upload the images to WP media library
  await page.setInputFiles( 'input[type="file"]', './tests/playwright/resources/A.jpg' );
  await page.setInputFiles( 'input[type="file"]', './tests/playwright/resources/B.jpg' );
  await page.setInputFiles( 'input[type="file"]', './tests/playwright/resources/C.jpg' );
  await page.setInputFiles( 'input[type="file"]', './tests/playwright/resources/D.jpg' );
  await page.setInputFiles( 'input[type="file"]', './tests/playwright/resources/E.jpg' );

  // Create a new gallery
  await page.locator( 'text=Create a new gallery' ).click();

  // Insert gallery
  await page.locator( 'text=Insert gallery' ).click();

  expect( await editor.getPreviewFrame().locator( 'div#gallery-1' ).screenshot( { type: 'jpeg', quality: 70 } ) ).toMatchSnapshot( 'gallery.jpeg' );
} );
