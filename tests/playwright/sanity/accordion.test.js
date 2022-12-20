const { test, expect } = require( '@playwright/test' );
const WpAdminPage = require( '../pages/wp-admin-page.js' );

test( 'Accordion', async ( { page }, testInfo ) => {
    // Arrange.
    const wpAdmin = new WpAdminPage( page, testInfo ),
    editor = await wpAdmin.useElementorPost( 'accordion' );

    // Act
    await editor.togglePreviewMode();

    // Assert
    expect( await editor.getPreviewFrame().locator( '.elementor-widget-wrap > .elementor-background-overlay' ).screenshot( { type: 'jpeg', quality: 90 } ) ).toMatchSnapshot( 'accordion.jpeg' );
} );
