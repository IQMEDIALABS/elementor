import EditorPage from '../../../pages/editor-page';
import { type APIRequestContext, Page, type TestInfo } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page';
import { controlIds, selectors } from './selectors';
import { proStepIds, Step, StepId } from '../../../types/checklist';
import ApiRequests from '../../../assets/api-requests';

export default class ChecklistHelper {
	readonly page: Page;
	readonly editor: EditorPage;
	readonly wpAdmin: WpAdminPage;
	readonly apiRequests: ApiRequests;

	constructor( page: Page, testInfo: TestInfo, apiRequest: ApiRequests ) {
		this.page = page;
		this.editor = new EditorPage( page, testInfo );
		this.wpAdmin = new WpAdminPage( page, testInfo, apiRequest );
		this.apiRequests = apiRequest;
	}

	async setChecklistSwitcherInPreferences( shouldShow: boolean ) {
		await this.editor.openUserPreferencesPanel();
		await this.editor.setSwitcherControlValue( controlIds.preferencePanel.checklistSwitcher, shouldShow );
		await this.page.waitForResponse( ( response ) => response.url().includes( 'wp-admin/admin-ajax.php' ), { timeout: 30000 } );
	}

	async toggleChecklist( frame: 'editor' | 'wp-admin', shouldOpen: boolean ) {
		if ( shouldOpen === await this.isChecklistOpen( frame ) ) {
			return;
		}

		const context = 'editor' === frame ? this.editor.page : this.page;

		if ( 'editor' === frame && await this.editor.hasTopBar() ) {
			await context.locator( selectors.topBarIcon ).click();
		} else if ( 'editor' === frame ) {
			// TODO: Implement openChecklist with no top bar
		} else {
			// TODO: Implement openChecklist in wp-admin
		}

		await context.locator( selectors.popup ).waitFor( { state: shouldOpen ? 'visible' : 'hidden' } );
	}

	async toggleChecklistItem( itemId: string, frame: 'editor' | 'wp-admin', shouldExpand: boolean ) {
		if ( ! await this.isChecklistOpen( frame ) ) {
			await this.toggleChecklist( frame, true );
		}

		if ( shouldExpand === await this.isChecklistItemExpanded( itemId, frame ) ) {
			return;
		}

		await this.page.click( this.getStepItemSelector( itemId ) );
	}

	async isChecklistOpen( frame: 'editor' | 'wp-admin' ) {
		return 'editor' === frame
			? await this.editor.page.locator( selectors.popup ).isVisible()
			: await this.page.locator( selectors.popup ).isVisible();
	}

	async isChecklistItemExpanded( itemId: string, frame: 'editor' | 'wp-admin' ) {
		const checklistItemSelector = this.getStepContentSelector( itemId ),
			context = frame ? this.editor.page : this.page;

		return await this.isChecklistOpen( frame ) && await context.locator( checklistItemSelector ).isVisible();
	}

	async toggleMarkAsDone( itemId: string, frame: 'editor' | 'wp-admin' ) {
		await this.toggleChecklistItem( itemId, frame, true );

		const markAsButton = this.page.locator( this.getStepContentSelector( itemId, selectors.markAsButton ) ),
			buttonText = await markAsButton.textContent();

		await this.page.locator( this.getStepContentSelector( itemId, selectors.markAsButton ) ).click();
		await this.page
			.locator( this.getStepContentSelector( itemId ) )
			.getByText( buttonText, { exact: true } )
			.waitFor( { state: 'hidden' } );
	}

	async getProgressFromPopup( frame: 'editor' | 'wp-admin' ) {
		if ( ! await this.isChecklistOpen( frame ) ) {
			await this.toggleChecklist( frame, true );
		}

		const progress = await this.page.locator( selectors.progressBarPercentage ).textContent();

		return +progress.replace( '%', '' );
	}

	getStepContentSelector( itemId: string, innerSelector: string = '' ) {
		return `${ selectors.popup } ${ selectors.checklistItemContent }.checklist-step-${ itemId } ${ innerSelector }`;
	}

	getStepItemSelector( itemId: string, innerSelector: string = '' ) {
		return `${ selectors.popup } ${ selectors.checklistItemButton }.checklist-step-${ itemId } ${ innerSelector }`;
	}

	async getSteps( request: APIRequestContext ): Promise< Step[] > {
		return ( await this.apiRequests.customGet( request, 'wp-json/elementor/v1/checklist/steps' ) ).data;
	}

	async resetStepsInDb( request: APIRequestContext ) {
		const steps = await this.getSteps( request );

		for ( const step of steps ) {
			await this.apiRequests.customPut( request, `wp-json/elementor/v1/checklist/steps/${ step.config.id }`, {
				id: step.config.id,
				is_marked_completed: false,
				is_absolute_completed: false,
				is_immutable_completed: false,
			} );
		}
	}

	isStepCompleted( step: Step ) {
		return step.is_absolute_completed || step.is_marked_completed || step.is_immutable_completed;
	}

	isStepProLocked( stepId: StepId ) {
		return proStepIds.includes( stepId );
	}
}

