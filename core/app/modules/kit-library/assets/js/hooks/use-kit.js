import { useQuery, useQueryClient } from 'react-query';
import Kit from '../models/kit';
import { KEY as LIST_KEY } from './use-kits';

export const KEY = 'kit';

const { useCallback } = React;

export default function useKit( id ) {
	// A function that returns existing data from the kit list for a placeholder data before the kit request will resolved.
	const placeholderDataCallback = usePlaceholderDataCallback( id );

	return useQuery( [ KEY, id ], fetchKitItem, {
			placeholderData: placeholderDataCallback,
		}
	);
}

/**
 * Return placeholder function for kit query.
 *
 * @param id
 * @returns {function(): (undefined|*)}
 */
function usePlaceholderDataCallback( id ) {
	const queryClient = useQueryClient();

	return useCallback( () => {
		const placeholder = queryClient.getQueryData( LIST_KEY )
			?.find( ( kit ) => {
				return kit.id === id;
			} );

		if ( ! placeholder ) {
			return;
		}

		return placeholder;
	}, [ queryClient, id ] );
}

/**
 * Fetch kit
 *
 * @param key
 * @param id
 * @returns {Promise<Kit>}
 */
function fetchKitItem( { queryKey: [ key, id ] } ) {
	return $e.data.get( 'kits/index', { id }, { refresh: true } )
		.then( ( response ) => response.data )
		.then( ( { data } ) => Kit.createFromResponse( data ) );
}
