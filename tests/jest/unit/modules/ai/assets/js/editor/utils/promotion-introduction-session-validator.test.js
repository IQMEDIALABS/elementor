import {
	shouldShowPromotionIntroduction, HOURS_BETWEEN_PROMOTION_INTRODUCTIONS,
} from 'elementor/modules/ai/assets/js/editor/utils/promotion-introduction-session-validator';

describe( 'Promotion Introduction Session Validator', () => {
	let mockSession;

	beforeEach( async () => {
		// Create a mock session object with getItem and setItem methods
		mockSession = {
			getItem: jest.fn(),
			setItem: jest.fn(),
		};
		window.EDITOR_SESSION_ID = 'editor-session-123';
	} );

	it( 'Should return true when has no previous session value', async () => {
		const result = shouldShowPromotionIntroduction( mockSession );

		expect( result ).toBe( true );
	} );

	it( `Should return false same editor session id`, async () => {
		window.EDITOR_SESSION_ID = 'editor-session-123';
		mockSession.getItem.mockReturnValue( 'editor-session-123' );

		const result = shouldShowPromotionIntroduction( mockSession );

		expect( result ).toBe( false );
	} );

	it( `Should return false when previous promotion appeared less than ${ HOURS_BETWEEN_PROMOTION_INTRODUCTIONS } hours ago`, async () => {
		const currentDate = new Date( 2024, 5, 3, 15 );
		const previousDate = new Date( currentDate.getTime() - ( 1000 * 60 * 60 * 2 ) ).getTime().toString();
		mockSession.getItem.mockReturnValue( 'editor-session-123#' + previousDate );

		const result = shouldShowPromotionIntroduction( mockSession );

		expect( result ).toBe( false );
	} );

	it( `Should return true when previous promotion appeared after ${ HOURS_BETWEEN_PROMOTION_INTRODUCTIONS } hours`, async () => {
		const previousDate = new Date( ).getTime() - ( 1000 * 60 * 60 * HOURS_BETWEEN_PROMOTION_INTRODUCTIONS ).toString();
		mockSession.getItem.mockReturnValue( 'editor-session-123#' + previousDate );

		const result = shouldShowPromotionIntroduction( mockSession );

		expect( result ).toBe( true );
	} );
} );
