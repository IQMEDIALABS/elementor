import {
	createSlice,
	ReducersMapObject,
	configureStore,
	combineReducers,
	ThunkMiddleware,
	Store,
	Slice,
	AnyAction,
	CreateSliceOptions,
} from '@reduxjs/toolkit';

export type {
	Slice,
	CreateSliceOptions,
	PayloadAction,
	Store,
	Dispatch,
	AnyAction,
	Action,
	MiddlewareAPI,
} from '@reduxjs/toolkit';

export { createSlice } from '@reduxjs/toolkit';

export { useSelector, useDispatch, Provider as StoreProvider } from 'react-redux';

// Usage: SliceState<typeof slice>
export type SliceState<S extends Slice> = {
	[ key in S['name'] ]: ReturnType<S['getInitialState']>;
}

interface SlicesMap {
	[key: Slice['name']]: Slice;
}

class StoreService {
	private instance: Store | null = null;
	private slices: SlicesMap = {};
	private pendingActions: AnyAction[] = [];
	private middlewares = new Set<ThunkMiddleware>();

	private getReducers() {
		const reducers = Object.entries( this.slices ).reduce( ( reducersData: ReducersMapObject, [ name, slice ] ) => {
			reducersData[ name ] = slice.reducer;

			return reducersData;
		}, {} );

		return combineReducers( reducers );
	}

	// Should be casted into createSlice because this function detects the correct type only when the slice object is passed directly to it.
	registerSlice( sliceConfig: CreateSliceOptions ) {
		const slice = createSlice( sliceConfig );

		if ( this.slices[ slice.name ] ) {
			return this.slices[ slice.name ];
		}

		this.slices[ slice.name ] = slice;

		return slice;
	}

	registerMiddleware( middleware: ThunkMiddleware ) {
		this.middlewares.add( middleware );
	}

	dispatch( action: AnyAction ) {
		if ( ! this.instance ) {
			this.pendingActions.push( action );

			return;
		}

		return this.instance.dispatch( action );
	}

	createStore() {
		if ( ! this.instance ) {
			this.instance = configureStore( {
				reducer: this.getReducers(),
				middleware: Array.from( this.middlewares ),
			} );

			if ( this.pendingActions.length ) {
				this.pendingActions.forEach( ( action ) => this.instance?.dispatch( action ) );
				this.pendingActions = [];
			}
		}

		return this.instance;
	}

	getStore() {
		return this.instance;
	}

	resetStore() {
		this.instance = null;
		this.slices = {};
		this.pendingActions = [];
		this.middlewares.clear();
	}
}

export const createStoreService = () => {
	return new StoreService();
};
