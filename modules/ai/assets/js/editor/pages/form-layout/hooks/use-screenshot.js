import { useState } from 'react';
import useLayoutPrompt from './use-layout-prompt';

const useScreenshot = ( type, onData ) => {
	const [ error, setError ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );

	const layoutData = useLayoutPrompt( type, null );

	const generate = ( prompt, signal ) => {
		setIsLoading( true );

		return layoutData.send( prompt, signal )
			.then( async ( data ) => {
				const createdScreenshot = await onData( data.result );

				createdScreenshot.sendUsageData = () => layoutData.sendUsageData( data );

				return createdScreenshot;
			} )
			.catch( ( e ) => {
				setError( e.message || 'unknown_error' );

				throw e;
			} )
			.finally( () => setIsLoading( false ) );
	};

	return {
		generate,
		error: layoutData.error?.message || error?.message || '',
		isLoading: layoutData.isLoading || isLoading,
	};
};

export default useScreenshot;
