export const appsEventTrackingDispatch = ( command, eventParams ) => {
	// Name modifications in eventParams object.
	const keyRename = ( obj, oldKey, newKey ) => {
		delete Object.assign( obj, { [ newKey ]: obj[ oldKey ] } )[ oldKey ];
	}

	// Add existing eventParams key value pair to the data/details object.
	const objectCreator = ( array, obj ) => {
		for ( const key of array ) {
			if ( eventParams.hasOwnProperty( key ) && eventParams[ key ] !== null ) {
				obj[ key ] = eventParams[ key ];
			}
		}
		return obj;
	};

	keyRename( eventParams, 'source', 'page_source' );

	const dataKeys = [];
	const detailsKeys = [ 'document_name', 'document_type', 'view_type_clicked', 'tag', 'sort_direction', 'sort_type', 'action', 'grid_location', 'kit_name', 'page_source', 'element_position', 'element', 'event_type', 'modal_type', 'method', 'status', 'step', 'item', 'category', 'element_location', 'search_term', 'section', 'site_area' ];
	const data = {};
	const details = {};

	const init = () => {
		objectCreator( detailsKeys, details );
		objectCreator( dataKeys, data );

		const commandSplit = command.split( '/' )
		data.placement = commandSplit[ 0 ];
		data.event = commandSplit[ 1 ];

		// If 'details' is not empty, add the details object to the data object.
		if ( Object.keys( details ).length ) {
			data.details = details;
		}
	};

	init();

	$e.run( command, data );
	console.log( 'appsEventTrackingDispatch', data );
};
