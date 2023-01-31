import { isRouteActive, openRoute, runCommand } from '../';

type ExtendedWindow = Window & {
	$e: {
		run: jest.Mock;
		route: jest.Mock;
	}
}

describe( '@elementor/v1-adapters/dispatchers', () => {
	let eRun: jest.Mock, eRoute: jest.Mock;

	beforeEach( () => {
		( window as unknown as ExtendedWindow ).$e = {
			run: jest.fn(),
			route: jest.fn(),
			routes: {
				isPartOf: jest.fn(),
			},
		};

		eRun = ( window as unknown as ExtendedWindow ).$e.run;
		eRoute = ( window as unknown as ExtendedWindow ).$e.route;
	} );

	afterEach( () => {
		delete ( window as unknown as { $e?: unknown } ).$e;
	} );

	it( 'should run a V1 command that returns Promise', () => {
		// Arrange.
		const command = 'editor/documents/open',
			args = { test: 'arg' };

		eRun.mockReturnValue( Promise.resolve( 'result' ) );

		// Act.
		const result = runCommand( command, args );

		// Assert.
		expect( eRun ).toHaveBeenCalledWith( command, args );
		expect( result ).toEqual( Promise.resolve( 'result' ) );
	} );

	it( 'should run a V1 command that returns jQuery.Deferred object', () => {
		// Arrange.
		const command = 'editor/documents/open',
			args = { test: 'arg' };

		eRun.mockReturnValue( makeJQueryDeferred( 'result' ) );

		// Act.
		const result = runCommand( command, args );

		// Assert.
		expect( eRun ).toHaveBeenCalledWith( command, args );
		expect( result ).toEqual( Promise.resolve( 'result' ) );
	} );

	it( 'should run a V1 command that returns a plain value', () => {
		// Arrange.
		const command = 'editor/documents/open',
			args = { test: 'arg' };

		eRun.mockReturnValue( 'result' );

		// Act.
		const result = runCommand( command, args );

		// Assert.
		expect( eRun ).toHaveBeenCalledWith( command, args );
		expect( result ).toEqual( Promise.resolve( 'result' ) );
	} );

	it( 'should reject when trying to run a V1 command and `$e.run()` is unavailable', () => {
		// Arrange.
		delete ( window as { $e?: unknown } ).$e;

		// Act & Assert.
		expect( () => runCommand( 'editor/documents/open' ) )
			.rejects
			.toEqual( '`$e.run()` is not available' );
	} );

	it( 'should open a V1 route', () => {
		// Arrange.
		const route = 'test/route';

		// Act.
		const result = openRoute( route );

		// Assert.
		expect( eRoute ).toHaveBeenCalledWith( route );
		expect( result ).toEqual( Promise.resolve() );
	} );

	it( 'should reject when failing to open a V1 route', () => {
		// Arrange.
		const route = 'test/route';

		eRoute.mockImplementation( ( r: string ) => {
			throw `Cannot find ${ r }`;
		} );

		// Act.
		expect( () => openRoute( route ) )
			.rejects
			.toEqual( 'Cannot find test/route' );
	} );

	it( 'should reject when trying to open a V1 route and `$e.route()` is unavailable', () => {
		// Arrange.
		delete ( window as { $e?: unknown } ).$e;

		// Act & Assert.
		expect( () => openRoute( 'test/route' ) )
			.rejects
			.toEqual( '`$e.route()` is not available' );
	} );

	it( 'should determine if a route is active', () => {
		// Arrange.
		const route = 'test/route';

		( window as any ).$e.routes.isPartOf.mockReturnValue( true );

		// Act.
		const result = isRouteActive( route );

		// Assert.
		expect( result ).toEqual( true );
		expect( ( window as any ).$e.routes.isPartOf ).toHaveBeenCalledTimes( 1 );
		expect( ( window as any ).$e.routes.isPartOf ).toHaveBeenCalledWith( route );
	} );
} );

function makeJQueryDeferred( value: unknown ) {
	return {
		then: () => value,
		promise: () => value,
		fail: () => {
			throw 'Error';
		},
	};
}
