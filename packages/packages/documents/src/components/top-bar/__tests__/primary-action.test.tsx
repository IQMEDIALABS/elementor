import { Document } from '../../../types';
import PrimaryAction from '../primary-action';
import { render } from '@testing-library/react';
import { useActiveDocument, useActiveDocumentActions } from '../../../hooks';

jest.mock( '../../../hooks', () => ( {
	useActiveDocument: jest.fn(),
	useActiveDocumentActions: jest.fn(),
} ) );

const mockedUseActiveDocument = jest.mocked( useActiveDocument );

const actionsMock = {
	save: jest.fn(),
	saveDraft: jest.fn(),
	saveTemplate: jest.fn(),
};

jest.mocked( useActiveDocumentActions ).mockReturnValue( actionsMock );

describe( '@elementor/documents - Top Bar Primary Action', () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'should not render when there is no active document', () => {
		// Arrange.
		mockedUseActiveDocument.mockReturnValue( null );

		// Act.
		const { container } = render( <PrimaryAction /> );

		// Assert.
		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'should have "Submit" text when the user cannot publish the document', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			userCan: {
				publish: false,
			},
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		// Assert.
		expect( container ).toHaveTextContent( 'Submit' );
	} );

	it( 'should have "Publish" text when the user can publish the document', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			userCan: {
				publish: true,
			},
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		// Assert.
		expect( container ).toHaveTextContent( 'Publish' );
	} );

	it( 'should be disabled when the document is a Kit', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			type: 'kit',
			isDirty: true,
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		// Assert.
		expect( container.querySelector( 'button' ) ).toBeDisabled();
	} );

	it( 'should be disabled when the document is pristine', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			isDirty: false,
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		// Assert.
		expect( container.querySelector( 'button' ) ).toBeDisabled();
	} );

	it( 'should be enabled when the document is Draft', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			isDirty: false,
			status: 'draft',
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		// Assert.
		expect( container.querySelector( 'button' ) ).toBeEnabled();
	} );

	it( 'should save the current document on click', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			isDirty: true,
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		container.querySelector( 'button' )?.click();

		// Assert.
		expect( actionsMock.save ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'should show a loader & not save when there is save in progress', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			isDirty: true,
			isSaving: true,
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );

		container.querySelector( 'button' )?.click();
		const loader = container.querySelector( 'svg' );

		// Assert.
		expect( actionsMock.save ).not.toHaveBeenCalled();
		expect( loader ).toBeInTheDocument();
		expect( container.textContent ).toBe( '' );
	} );

	it( 'should not show a loader when the button is disabled', () => {
		// Arrange.
		const mockDocument = makeMockDocument();

		mockedUseActiveDocument.mockReturnValue( {
			...mockDocument,
			type: 'kit', // Disables the button.
			isSaving: true,
		} );

		// Act.
		const { container } = render( <PrimaryAction /> );
		const loader = container.querySelector( 'svg' );

		// Assert.
		expect( loader ).not.toBeInTheDocument();
		expect( container.textContent ).not.toBe( '' );
	} );
} );

function makeMockDocument(): Document {
	return {
		id: 1,
		title: 'Document 1',
		status: 'publish',
		type: 'page',
		isDirty: false,
		isSaving: false,
		isSavingDraft: false,
		userCan: {
			publish: true,
		},
	};
}
