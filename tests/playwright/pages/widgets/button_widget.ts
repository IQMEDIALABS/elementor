import EditorSelectors from '../../selectors/editor-selectors';
import Content from '../elementor-panel-tabs/content';
import { expect } from '@playwright/test';

export default class ButtonWidget extends Content {
	async addWidget( buttonName: string ) {
		await this.editorPage.addWidget( 'button' );
		await this.editorPage.getPreviewFrame().waitForSelector( EditorSelectors.button.getByName( buttonName ) );
	}

	async setButtonId( buttonId: string, buttonName: string ) {
		await this.page.locator( EditorSelectors.button.id ).type( buttonId );
		await expect( this.editorPage.getPreviewFrame().locator( EditorSelectors.button.getByName( buttonName ) ) ).toHaveAttribute( 'id', buttonId );
	}

	async getButtonId( buttonName: string, isPublished = true ) {
		if ( isPublished ) {
			return await this.page.locator( EditorSelectors.button.getByName( buttonName ) ).getAttribute( 'id' );
		}
		return await this.editorPage.getPreviewFrame().locator( EditorSelectors.button.getByName( buttonName ) ).getAttribute( 'id' );
	}
}
