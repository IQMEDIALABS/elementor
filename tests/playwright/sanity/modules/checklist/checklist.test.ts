import { expect } from '@playwright/test';
import { parallelTest as test } from '../../../parallelTest';
import WpAdminPage from '../../../pages/wp-admin-page';
import { controlIds, selectors } from './selectors';
import ChecklistHelper from './helper';
import { StepId } from '../../../types/checklist';

test.describe( 'Launchpad checklist tests @checklist', () => {
	test.beforeAll( async ( { browser, apiRequests }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );

		await wpAdmin.setExperiments( {
			editor_v2: true,
			'launchpad-checklist': true,
		} );

		await page.close();
	} );

	test.beforeEach( async ( { browser, apiRequests, request }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );

		await wpAdmin.openNewPage();

		// Delete all pages
		const checklistHelper = new ChecklistHelper( page, testInfo, apiRequests );

		await apiRequests.cleanUpTestPages( request );
		await checklistHelper.resetStepsInDb( request );

		await page.close();
	} );

	test.afterAll( async ( { browser, apiRequests }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );

		await wpAdmin.resetExperiments();
		await page.close();
	} );

	test( 'Mark as done function in the editor - top bar on', async ( { page, apiRequests, request }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );

		await wpAdmin.openNewPage();

		const checklistHelper = new ChecklistHelper( page, testInfo, apiRequests ),
			steps = await checklistHelper.getSteps( request ),
			doneStepIds: StepId[] = [];

		await checklistHelper.toggleChecklist( 'editor', true );

		for ( const step of steps ) {
			if ( checklistHelper.isStepProLocked( step.config.id ) ) {
				continue;
			}

			const markAsButton = page.locator( checklistHelper.getStepContentSelector( step.config.id, selectors.markAsButton ) ),
				checkIconSelector = checklistHelper.getStepItemSelector( step.config.id, selectors.stepIcon );

			await checklistHelper.toggleChecklistItem( step.config.id, 'editor', true );
			await expect( markAsButton ).toHaveText( 'Mark as done' );
			await expect( page.locator( checkIconSelector + '.unchecked' ) ).toBeVisible();

			await checklistHelper.toggleMarkAsDone( step.config.id, 'editor' );
			doneStepIds.push( step.config.id );
			await expect( markAsButton ).toHaveText( 'Unmark as done' );
			await expect( page.locator( checkIconSelector + '.checked' ) ).toBeVisible();

			expect( await checklistHelper.getProgressFromPopup( 'editor' ) )
				.toBe( Math.round( doneStepIds.length * 100 / steps.length ) );
		}

		// Resetting for the sake of the next test
		for ( const stepId of doneStepIds ) {
			await checklistHelper.toggleMarkAsDone( stepId, 'editor' );
		}
	} );

	test( 'Checklist module general test', async ( { page, apiRequests }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests ),
			editor = await wpAdmin.openNewPage();

		await test.step( 'Rocket Icon in top bar is visible', async () => {
			const rocketButton = editor.page.locator( selectors.topBarIcon );
			await expect( rocketButton ).toBeVisible();
		} );

		await test.step( 'Open checklist trigger', async () => {
			const rocketButton = editor.page.locator( selectors.topBarIcon ),
				checklist = editor.page.locator( selectors.popup );

			await rocketButton.click();
			await expect( checklist ).toBeVisible();
		} );

		await test.step( 'Close checklist trigger', async () => {
			const closeButton = editor.page.locator( selectors.closeButton ),
				checklist = editor.page.locator( selectors.popup );

			await closeButton.click();
			await expect( checklist ).toBeHidden();
		} );
	} );

	test( 'Checklist preference switch effects', async ( { page, apiRequests }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );
		let checklistHelper = new ChecklistHelper( page, testInfo, apiRequests );

		await wpAdmin.setExperiments( {
			'launchpad-checklist': false,
		} );

		const editor = await wpAdmin.openNewPage();
		checklistHelper = new ChecklistHelper( page, testInfo, apiRequests );

		await test.step( 'Assert nothing is visible when experiment is off', async () => {
			await editor.openUserPreferencesPanel();
			await editor.openSection( 'preferences' );

			await expect( page.locator( `.elementor-control-${ controlIds.preferencePanel.checklistSwitcher }` ) ).toBeHidden();
			await expect( page.locator( selectors.topBarIcon ) ).toBeHidden();
		} );

		await wpAdmin.setExperiments( {
			'launchpad-checklist': true,
		} );
		await wpAdmin.openNewPage();

		await test.step( 'Assert switch is visible in user preferences', async () => {
			await editor.openUserPreferencesPanel();
			await editor.openSection( 'preferences' );

			await expect.soft( page.locator( `.elementor-control-${ controlIds.preferencePanel.checklistSwitcher }` ) )
				.toHaveScreenshot( 'checklist-switch-on.png' );
			await expect( page.locator( selectors.topBarIcon ) ).toBeVisible();
		} );

		await test.step( 'Assert no top bar icon when switch is off', async () => {
			await checklistHelper.toggleChecklist( 'editor', true );
			await editor.page.waitForSelector( selectors.popup );

			await expect( page.locator( selectors.topBarIcon ) ).toBeVisible();

			await checklistHelper.setChecklistSwitcherInPreferences( false );

			await expect( page.locator( selectors.topBarIcon ) ).toBeHidden();
			await expect( editor.page.locator( selectors.popup ) ).toBeHidden();
		} );

		await page.reload();
		await page.waitForLoadState( 'load', { timeout: 20000 } );
		await wpAdmin.waitForPanel();

		await test.step( 'Assert off preference is saved and items are hidden', async () => {
			await editor.openUserPreferencesPanel();
			await editor.openSection( 'preferences' );

			await expect.soft( page.locator( `.elementor-control-${ controlIds.preferencePanel.checklistSwitcher }` ) )
				.toHaveScreenshot( 'checklist-switch-off.png' );
			await expect( page.locator( selectors.topBarIcon ) ).toBeHidden();
		} );

		await checklistHelper.setChecklistSwitcherInPreferences( true );
	} );

	test( 'Progress Bar', async ( { page, apiRequests, request }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests ),
			editor = await wpAdmin.openNewPage(),
			checklistHelper = new ChecklistHelper( page, testInfo, apiRequests ),
			steps = await checklistHelper.getSteps( request ),
			progressToCompare = Math.round( steps.filter( checklistHelper.isStepCompleted ).length * 100 / steps.length ),
			rocketButton = editor.page.locator( selectors.topBarIcon ),
			pageProgress = await checklistHelper.getProgressFromPopup( 'editor' );

		await rocketButton.click();

		expect( pageProgress ).toBe( progressToCompare );
	} );
} );
