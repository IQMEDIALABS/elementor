import { ReducerUtils } from '../utils/reducer-utils';

export const reducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case 'ADD_INCLUDE':
			return ReducerUtils.updateArray( state, 'includes', payload, 'add' );
		case 'REMOVE_INCLUDE':
			return ReducerUtils.updateArray( state, 'includes', payload, 'remove' );
		case 'SET_REFERRER':
			return { ...state, referrer: payload };
		case 'SET_INCLUDES':
			return { ...state, includes: payload };
		default:
			return state;
	}
};
