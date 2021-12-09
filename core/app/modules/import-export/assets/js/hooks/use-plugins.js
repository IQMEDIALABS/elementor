import { useState, useEffect } from 'react';

const PLUGINS_STATUS_MAP = Object.freeze( {
	INITIAL: 'initial',
	SUCCESS: 'success',
	ERROR: 'error',
} );

export default function usePlugins() {
	const getInitialState = () => ( {
			status: PLUGINS_STATUS_MAP.INITIAL,
			data: null,
		} ),
		[ pluginsState, setPluginsState ] = useState( getInitialState() ),
		baseEndpoint = elementorCommon.config.urls.rest + 'wp/v2/plugins/',
		fetchRest = ( { body, method, endpoint = '' } ) => {
			const data = {
				method,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'X-WP-Nonce': wpApiSettings.nonce,
				},
			};

			if ( body ) {
				data.body = JSON.stringify( body );
			}

			return new Promise( ( resolve, reject ) => {
				fetch( baseEndpoint + endpoint, data )
					.then( ( response ) => response.json() )
					.then( ( response ) => {
						setPluginsState( {
							status: PLUGINS_STATUS_MAP.SUCCESS,
							data: response,
						} );

						resolve( response );
					} )
					.catch( ( error ) => {
						setPluginsState( {
							status: PLUGINS_STATUS_MAP.ERROR,
							data: error,
						} );

						reject( error );
					} );
			} );
		},
		get = () => {
			return fetchRest( {
				method: 'GET',
			} );
		},
		install = ( slug ) => {
			if ( slug.indexOf( '/' ) > -1 ) {
				slug = slug.split( '/' )[ 0 ];
			}

			return fetchRest( {
				method: 'POST',
				body: {
					slug,
				},
			} );
		},
		activate = ( slug ) => {
			return fetchRest( {
				endpoint: slug,
				method: 'PUT',
				body: {
					status: 'active',
				},
			} );
		},
		deactivate = ( slug ) => {
			return fetchRest( {
				endpoint: slug,
				method: 'PUT',
				body: {
					status: 'inactive',
				},
			} );
		},
		reset = () => setPluginsState( getInitialState() );

	useEffect( () => {
		get();
	}, [] );

	return {
		pluginsState,
		pluginsActions: {
			get,
			install,
			activate,
			deactivate,
			reset,
		},
		PLUGINS_STATUS_MAP,
	};
}
