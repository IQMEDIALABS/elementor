import { Document, ExtendedWindow, V1Document } from '../';

export function getV1DocumentsManager() {
	const documentsManager = ( window as unknown as ExtendedWindow ).elementor?.documents;

	if ( ! documentsManager ) {
		throw new Error( 'Elementor Editor V1 documents manager not found' );
	}

	return documentsManager;
}

export function normalizeV1Document( documentData: V1Document ): Document {
	return {
		id: documentData.id,
		title: documentData.container.settings.get( 'post_title' ),
		status: documentData.container.settings.get( 'post_status' ),
		isDirty: documentData.editor.isChanged,
		isSaving: documentData.editor.isSaving,
		isSavingDraft: false,
		userCan: {
			publish: documentData.config.user.can_publish,
		},
	};
}
