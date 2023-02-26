import useActionProps from '../use-action-props';
import { renderHook } from '@testing-library/react-hooks';
import { openRoute, useRouteStatus } from '@elementor/v1-adapters';

jest.mock( '@elementor/v1-adapters', () => ( {
	openRoute: jest.fn(),
	useRouteStatus: jest.fn( () => ( { isActive: true, isBlocked: true } ) ),
} ) );

describe( '@elementor/history - useActionProps', () => {
	it( 'should open the history panel when clicked', () => {
		// Arrange.
		const { result } = renderHook( () => useActionProps() );

		// Act.
		result.current.onClick();

		// Assert.
		expect( openRoute ).toHaveBeenCalledTimes( 1 );
		expect( openRoute ).toHaveBeenCalledWith( 'panel/history/actions' );
	} );

	it( 'should have the correct props for disabled and selected', () => {
		// Act.
		const { result } = renderHook( () => useActionProps() );

		// Assert.
		expect( result.current.selected ).toBe( true );
		expect( result.current.disabled ).toBe( true );
		expect( useRouteStatus ).toHaveBeenCalledTimes( 1 );
		expect( useRouteStatus ).toHaveBeenCalledWith( 'panel/history' );
	} );
} );
