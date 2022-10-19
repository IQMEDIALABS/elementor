import store from 'elementor/modules/kit-elements-defaults/assets/js/editor/store';

jest.mock( 'elementor/modules/kit-elements-defaults/assets/js/editor/store', () => ( {
	__esModule: true,
	default: {
		upsert: jest.fn(),
	},
} ) );

describe( `$e.run( 'kit-elements-defaults/create' )`, () => {
	let CreateCommand;

	beforeEach( async () => {
		global.$e = {
			internal: jest.fn(),
			modules: {
				CommandBase: class {},
			},
		};

		global.elementor = {
			notifications: {
				showToast: jest.fn(),
			},
		};

		// Need to import dynamically since the command extends a global variable which isn't available in regular import.
		CreateCommand = ( await import( 'elementor/modules/kit-elements-defaults/assets/js/editor/commands' ) ).Create;
	} );

	afterEach( () => {
		delete global.$e;
		delete global.elementor;

		jest.resetAllMocks();
	} );

	it( 'should create new default values for button widget', () => {
		// Arrange
		const command = new CreateCommand();

		const container = createContainer( {
			widgetType: 'button',
			elType: 'widget',
			id: '123',
			settings: {
				text_shadow_text_shadow: { horizontal: 33, vertical: 0, blur: 10, color: 'rgba(0,0,0,0.3)' },
				border_border: 'solid',
				border_color: '#FF0000',
				text: 'Click me',
				invalid_control: 'invalid', // Should be removed since it's not a control.
				__globals__: {
					button_text_color: 'globals/colors?id=9182bce',
					background_color: 'globals/colors?id=secondary',
					border_color: 'globals/colors?id=secondary', // Should be removed since it has local value.
					invalid_control2: 'invalid', // Should be removed since it's not a control.
				},
				__dynamic__: {
					link: "[elementor-tag id=\"4f74e2e\" name=\"post-url'\" settings=\"%7B%7D\"]",
					text: "[elementor-tag id=\"4f74e2e\" name=\"post-url'\" settings=\"%7B%7D\"]", // Should be removed since it has local value.
				},
			},
			controls: {
				text_shadow_text_shadow: {},
				border_border: {},
				text: {},
				button_text_color: {},
				background_color: {},
				border_color: {},
				link: {},
			},
		} );

		// Act
		command.apply( { container } );

		// Assert
		expect( store.upsert ).toHaveBeenCalledWith( 'button', {
			text_shadow_text_shadow: { horizontal: 33, vertical: 0, blur: 10, color: 'rgba(0,0,0,0.3)' },
			border_border: 'solid',
			border_color: '#FF0000',
			text: 'Click me',
			__globals__: {
				button_text_color: 'globals/colors?id=9182bce',
				background_color: 'globals/colors?id=secondary',
			},
			__dynamic__: {
				link: "[elementor-tag id=\"4f74e2e\" name=\"post-url'\" settings=\"%7B%7D\"]",
			},
		} );
	} );

	it( 'should create new default values for section element', () => {
		// Arrange
		const command = new CreateCommand();

		const container = createContainer( {
			elType: 'section',
			id: '123',
			settings: {
				width: '100px',
			},
			controls: {
				width: {},
			},
		} );

		// Act
		command.apply( { container } );

		// Assert
		expect( store.upsert ).toHaveBeenCalledWith( 'section', { width: '100px' } );
	} );

	it( 'should throw an error if upsert fails', () => {
		// Arrange
		const command = new CreateCommand();

		const container = createContainer( {
			elType: 'section',
			id: '123',
			settings: {
				width: '100px',
			},
			controls: {
				width: {},
			},
		} );

		store.upsert.mockImplementation( () => {
			throw new Error( 'Failed to upsert' );
		} );

		// Act
		expect( () => command.apply( { container } ) ).rejects.toThrow( 'Failed to upsert' );
	} );
} );

function createContainer( {
	elType,
	widgetType,
	id,
	settings = {},
	controls = {},
} = {} ) {
	const container = {
		id,
		settings: {
			controls,
			toJSON: () => ( {
				...settings,
			} ),
		},
		model: {
			get: ( key ) => {
				const map = {
					elType,
					widgetType,
				};

				return map[ key ];
			},
		},
	};

	return container;
}
