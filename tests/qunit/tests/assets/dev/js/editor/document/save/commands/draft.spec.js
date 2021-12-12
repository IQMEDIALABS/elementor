import ElementsHelper from 'elementor/tests/utils/js/document-elements-helper.mjs';

let tempPostStatus,
	tempEditorStatus;

export const Draft = () => {
	QUnit.module( 'Draft', ( hooks ) => {
		hooks.before( () => {
			// Save the 'post_status' before the test, to put it back later.
			const currentDocument = elementor.documents.getCurrent();

			tempPostStatus = currentDocument.config.settings.settings.post_status;
			tempEditorStatus = currentDocument.editor.status;
		} );

		hooks.after( () => {
			// Put back as it was before.
			const currentDocument = elementor.documents.getCurrent();

			currentDocument.container.settings.set( 'post_status', tempPostStatus );
			currentDocument.editor.status = tempEditorStatus;
		} );

		QUnit.test( 'Document post_status is "publish"', async ( assert ) => {
			const document = elementor.documents.getCurrent();

			document.editor.status = 'open';

			ElementsHelper.settings( document.container, {
				post_status: 'publish',
			} );

			const result = await $e.run( 'document/save/draft' );

			assert.equal( result.data.status, 'inherit' );

			$e.internal( 'document/save/set-is-modified', { status: false } );
		} );

		QUnit.test( 'Document post_status is "private"', async ( assert ) => {
			const document = elementor.documents.getCurrent();

			document.editor.status = 'open';

			ElementsHelper.settings( document.container, {
				post_status: 'private',
			} );

			const result = await $e.run( 'document/save/draft' );

			assert.equal( result.data.status, 'inherit' );

			$e.internal( 'document/save/set-is-modified', { status: false } );
		} );

		QUnit.test( 'Document post_status is "draft"', async ( assert ) => {
			const document = elementor.documents.getCurrent();

			document.editor.status = 'open';

			ElementsHelper.settings( document.container, {
				post_status: 'draft',
			} );

			const result = await $e.run( 'document/save/draft' );

			// Ensure the document is published.
			assert.equal( result.data.status, 'draft' );
		} );

		QUnit.test( 'rejected: "Document is not editable"', ( assert ) => {
			// Create fake document.
			const document = elementor.documents.getCurrent(),
				defaultStatus = document.editor.status;

			// Editor is not edit able!
			document.editor.status = 'closed';

			// Put something that is not 'draft' to reach reject.
			ElementsHelper.settings( document.container, {
				post_status: 'private',
			} );

			assert.expect( 1 );

			assert.throws(
				() => {
					// Put back as it was before.
					$e.run( 'document/save/draft', { document } ).always( () => {
						document.editor.status = defaultStatus;
					} );
				},
				new Error( 'Error: Document is not editable' ),
			);
		} );
	} );
};

export default Draft;
