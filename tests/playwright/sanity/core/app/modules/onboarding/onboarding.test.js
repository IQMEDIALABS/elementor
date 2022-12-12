const { test, expect } = require( '@playwright/test' );
const { onboarding } = require( './onboarding.utils' );
const testData = JSON.parse( JSON.stringify( require( './onboarding.data.json' ) ) );

test.beforeEach( async ( { page }, testInfo ) => {
	helper = new onboarding( page, testInfo.project.use.baseURL );
} );

test.beforeAll( async ( { browser }, testInfo ) => {
	const page = await browser.newPage();
	helper = new onboarding( page, testInfo.project.use.baseURL );

	await helper.gotoThemesPage();
	await page.waitForLoadState( 'networkidle' );
	await helper.activateTwenty21Theme();
} );

test.afterAll( async ( { browser }, testInfo ) => {
	const page = await browser.newPage();
	helper = new onboarding( page, testInfo.project.use.baseURL );
	await helper.gotoThemesPage();
	await page.waitForLoadState( 'networkidle' );
	await helper.activateHelloTheme();
} );

test.describe( 'First Step - Elementor Account', () => {
	test( '"Upgrade" CTA Works and Check for Broken CSS', async ( { page } ) => {
		await helper.checkBrokenCSS( page, helper.step1URL );
		await helper.hoverOverGoProHeaderButton();
		await helper.checkGoProPopoverIsVisible();
		await helper.checkUpgradeFeatureListIsCorrect( testData.upgradeFeaturesList );
		await helper.openPopUpToProPage();
	} );

	test( '"Already Have Elementor Pro" link on popover works', async ( { page } ) => {
		await helper.gotoStep1();
		await helper.hoverOverGoProHeaderButton();

		const [ importPopup ] = await Promise.all( [
			page.waitForEvent( 'popup' ),
			helper.selectAlreadyHaveElementorProLink(),
		] );

		await expect( await importPopup.url() ).toContain( 'uploadAndInstallPro' );
	} );

	test( '"Connect Your Account" link works', async () => {
		await helper.gotoStep1();
		await helper.signInPopupWorks();
	} );

	test( 'User can close the onboarding process', async () => {
		await helper.gotoStep1();
		await helper.selectCloseOnboardingButton();
		await helper.checkUserIsOnWpAdminPage();
	} );

	test( 'Progress Bar: Only first step is filled', async () => {
		await helper.gotoStep1();
		await helper.checkCurrentStepIsFilled( 1 );
	} );

	test( '"Create my account" Popup Open', async () => {
		await helper.gotoStep1();
		await helper.checkButtonHasCorrectName( helper.createMyAccountButton, testData.createAccountButtonText );
		await helper.createMyAccountPopupWorks();
	} );

	test( '"Create Account" in the header Popup Open', async () => {
		await helper.gotoStep1();
		await helper.createAccountPopUpWorks();
	} );

	test( 'Skip to Hello Theme Page', async () => {
		await helper.gotoStep1();
		await helper.selectSkipButton();
		await helper.checkUserIsOnStepTwo();
	} );
} );

test.describe( 'Second Step - Hello Theme', () => {
	test( 'CSS is not Broken and Validated notice is present and skip works', async ( { page } ) => {
		await helper.checkBrokenCSS( page, helper.step2URL );
		await helper.checkDisclaimerIsPresent( testData.disclaimerNotice );
		await helper.selectSkipButton();
		await helper.checkUserIsOnStepThree();
	} );

	test( 'Progress Bar: Second step is filled and 3,4,5 are not', async () => {
		await helper.gotoStep2();
		await helper.checkCurrentStepIsFilled( 2 );
	} );

	test( ' "Continue with Hello Theme" button works', async ( { page } ) => {
		await helper.gotoStep2();
		await helper.selectContinueWithHelloThemeButton();
		await page.waitForNavigation( { url: 'wp-admin/admin.php?page=elementor-app#onboarding/siteName' }, { waitUntil: 'networkidle' } );
		await helper.gotoThemesPage();
		await helper.checkElementorThemeIsActive();
		await helper.activateTwenty21Theme();
	} );
} );

test.describe( 'Third Step - Hello Theme', () => {
	test( 'Check for Broken CSS and the site name is pre-filled', async ( { page } ) => {
		await helper.gotoStep3();
		const siteTitle = await helper.extractSiteTitle();
		await helper.checkBrokenCSS( page, helper.step3URL );
		await helper.checkTitleIsCorrect( siteTitle );
	} );

	test( 'Next Button active only when field is not empty', async () => {
		await helper.gotoStep3();
		await helper.emptySiteNameField();
		await helper.checkNextBottonIsDisabled();
		await helper.insertPageName( 'Best Blog' );
		await helper.checkNextBottonIsEnabled();
	} );

	test( 'Skip Button takes to step 4', async () => {
		await helper.gotoStep3();
		await helper.selectSkipButton();
		await helper.checkStepFourURL( helper.step4URL );
	} );

	test( 'Progress Bar: Third step is filled', async () => {
		await helper.gotoStep3();
		await helper.checkCurrentStepIsFilled( 3 );
	} );
} );

test.describe( 'Fourth Step - Upload Logo', () => {
	test( 'Check CSS and that user can remove a logo and the next button works accordingly', async ( { page } ) => {
		await helper.goToSiteItentityPage();
		await helper.uploadLogo();
		await helper.checkBrokenCSS( page, helper.step4URL );
		await helper.checkLogoIsPresent();
		await helper.checkNextBottonIsEnabled();
		await helper.removePotentialLogo();
		await helper.checkNextBottonIsDisabled();
	} );

	test( 'Selecting Skip takes to the 5th - good to go step', async () => {
		await helper.gotoStep4();
		await helper.selectSkipButton();
		await helper.checkUserIsOnStep5();
	} );

	test( 'User can upload a logo through step 4', async () => {
		await helper.makeSureLogoIsRemoved();
		await helper.gotoStep4();
		await helper.checkLogoIsNotPresent();
		await helper.addALogo();
	} );

	test( 'Progress Bar: Fourth step is filled and 5 are not', async () => {
		await helper.gotoStep4();
		await helper.checkCurrentStepIsFilled( 4 );
	} );
} );

test.describe( 'Fifth Step - Good to Go', () => {
	test( 'Check CSS and Check Kit Library with blank kit', async ( { page } ) => {
		await helper.checkBrokenCSS( page, helper.step5URL );
		await helper.selectKitLibaryOption();
		await helper.userIsOnTheLibraryKitsPage();
		await helper.checkFirstKitIsBlankCanvas();
		await helper.selectTheBlankCanvasKit();
		await helper.checkUserIsOnAFreshPost();
	} );

	test( 'Proceed with empty canvas', async () => {
		await helper.gotoStep5();
		await helper.selectEditWithBlankCanvas();
		await helper.checkUserIsOnAFreshPost();
	} );

	test( 'Skip Step 5', async () => {
		await helper.gotoStep5();
		await helper.selectSkipButton();
		await helper.checkUserIsOnAFreshPost();
	} );

	test( 'Progress Bar: Fifth step is filled', async () => {
		await helper.gotoStep5();
		await helper.checkCurrentStepIsFilled( 5 );
	} );
} );
