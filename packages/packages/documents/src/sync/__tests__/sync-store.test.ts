import { createSlice } from '../../store';
import { syncStore } from '../sync-store';
import { ExtendedWindow, Slice, V1Document } from '../../types';
import { flushListeners } from '@elementor/v1-adapters';
import { createStore, deleteStore, SliceState, Store } from '@elementor/store';
import {
	dispatchCommandAfter,
	dispatchCommandBefore,
	dispatchV1ReadyEvent,
	makeDocumentsManager,
	makeMockV1Document,
} from './test-utils';

type WindowWithV1Loading = Omit<ExtendedWindow, 'elementor'> & {
	__elementorEditorV1LoadingPromise?: Promise<void>;
	elementor?: ExtendedWindow['elementor'];
}

describe( '@elementor/documents/sync/store-sync', () => {
	let store: Store<SliceState<Slice>>;
	let slice: Slice;
	let extendedWindow: WindowWithV1Loading;

	beforeEach( () => {
		slice = createSlice();
		store = createStore();

		syncStore( slice );

		extendedWindow = ( window as unknown as WindowWithV1Loading );
		extendedWindow.__elementorEditorV1LoadingPromise = Promise.resolve();
	} );

	afterEach( () => {
		delete extendedWindow.__elementorEditorV1LoadingPromise;
		delete extendedWindow.elementor;

		flushListeners();
		deleteStore();
	} );

	it( 'should sync documents on V1 load', () => {
		// Arrange.
		mockV1DocumentsManager( [
			makeMockV1Document( 1 ),
			makeMockV1Document( 2 ),
		] );

		// Act.
		dispatchV1ReadyEvent();

		// Assert.
		const storeState = store.getState();

		expect( storeState.documents.entities ).toEqual( {
			1: {
				id: 1,
				title: 'Document 1',
				status: 'publish',
				isDirty: false,
				isSaving: false,
				isSavingDraft: false,
				userCan: {
					publish: true,
				},
			},
			2: {
				id: 2,
				title: 'Document 2',
				status: 'publish',
				isDirty: false,
				isSaving: false,
				isSavingDraft: false,
				userCan: {
					publish: true,
				},
			},
		} );
	} );

	it.each( [
		{
			type: 'V1 load',
			dispatchEvent: () => dispatchV1ReadyEvent(),
		},
		{
			type: 'document open',
			dispatchEvent: () => dispatchCommandAfter( 'editor/documents/open' ),
		},
	] )( 'should sync current document on $type', ( { dispatchEvent } ) => {
		// Arrange.
		mockV1DocumentsManager( [
			makeMockV1Document( 1 ),
			makeMockV1Document( 2 ),
		], 2 );

		// Act.
		dispatchEvent();

		// Assert.
		const currentDocument = getCurrentDocument( store );

		expect( currentDocument.id ).toBe( 2 );
		expect( currentDocument ).toEqual( {
			id: 2,
			title: 'Document 2',
			status: 'publish',
			isDirty: false,
			isSaving: false,
			isSavingDraft: false,
			userCan: {
				publish: true,
			},
		} );
	} );

	it( 'should sync saving state of a document on V1 load', () => {
		// Arrange.
		const mockDocument = makeMockV1Document();

		mockV1DocumentsManager( [
			{
				...mockDocument,
				editor: {
					...mockDocument.editor,
					isSaving: true,
				},
			},
		] );

		// Act.
		dispatchV1ReadyEvent();

		// Assert.
		expect( getCurrentDocument( store ).isSaving ).toBe( true );
	} );

	it( 'should sync saving state of a document on save', () => {
		// Arrange.
		mockV1DocumentsManager( [
			makeMockV1Document(),
		] );

		// Populate the documents state.
		dispatchV1ReadyEvent();

		// Assert - Default state.
		expect( getCurrentDocument( store ).isSaving ).toBe( false );

		// Act.
		dispatchCommandBefore( 'document/save/save' );

		// Assert - On save start.
		expect( getCurrentDocument( store ).isSaving ).toBe( true );
		expect( getCurrentDocument( store ).isSavingDraft ).toBe( false );

		// Act.
		dispatchCommandAfter( 'document/save/save' );

		// Assert - On save end.
		expect( getCurrentDocument( store ).isSaving ).toBe( false );
		expect( getCurrentDocument( store ).isSavingDraft ).toBe( false );
	} );

	it( 'should sync draft saving state of a document on save', () => {
		// Arrange.
		mockV1DocumentsManager( [
			makeMockV1Document(),
		] );

		// Populate the documents state.
		dispatchV1ReadyEvent();

		// Assert - Default state.
		expect( getCurrentDocument( store ).isSavingDraft ).toBe( false );

		// Act.
		dispatchCommandBefore( 'document/save/save', {
			status: 'autosave',
		} );

		// Assert - On save start.
		expect( getCurrentDocument( store ).isSaving ).toBe( false );
		expect( getCurrentDocument( store ).isSavingDraft ).toBe( true );

		// Act.
		dispatchCommandAfter( 'document/save/save', {
			status: 'autosave',
		} );

		// Assert - On save end.
		expect( getCurrentDocument( store ).isSaving ).toBe( false );
		expect( getCurrentDocument( store ).isSavingDraft ).toBe( false );
	} );

	it( 'should sync dirty state of a document on V1 load', () => {
		// Arrange.
		const mockDocument = makeMockV1Document();

		mockV1DocumentsManager( [ {
			...mockDocument,
			config: {
				...mockDocument.config,
				revisions: {
					current_id: 2,
				},
			},
		} ] );

		// Act.
		dispatchV1ReadyEvent();

		// Assert.
		expect( getCurrentDocument( store ).isDirty ).toBe( true );
	} );

	it( 'should sync modified state of a document on document change', () => {
		// Arrange.
		const mockDocument = makeMockV1Document();

		mockV1DocumentsManager( [
			mockDocument,
		] );

		// Populate the documents state.
		dispatchV1ReadyEvent();

		// Mock a change.
		mockV1DocumentsManager( [ {
			...mockDocument,
			editor: {
				...mockDocument.editor,
				isChanged: true,
			},
		} ] );

		// Assert - Default state.
		expect( getCurrentDocument( store ).isDirty ).toBe( false );

		// Act.
		dispatchCommandAfter( 'document/save/set-is-modified' );

		// Assert - After change.
		expect( getCurrentDocument( store ).isDirty ).toBe( true );
	} );
} );

function getCurrentDocument( store: Store<SliceState<Slice>> ) {
	const storeState = store.getState();
	const { activeId } = storeState.documents;

	return storeState.documents.entities[ activeId ];
}

function mockV1DocumentsManager( documentsArray: V1Document[], current: number = 1 ) {
	( window as unknown as WindowWithV1Loading ).elementor = {
		documents: makeDocumentsManager( documentsArray, current ),
	};
}
