import { toSvg } from 'html-to-image';
import { toggleHistory } from './history';

export const screenshot = async ( models = [] ) => {
	// Disable history so the Editor won't show our hidden containers as user actions.
	toggleHistory( false );

	const wrapper = createHiddenWrapper();
	const containers = createContainers( models );

	wrapContainers( containers, wrapper );

	// Wait for the containers to render.
	// TODO: Find a better solution.
	await sleep( 10 );

	const promises = containers.map( ( { view } ) => toSvg( view.$el[ 0 ] ) );

	const screenshots = await Promise.all( promises );

	deleteContainers( containers );

	wrapper.remove();

	toggleHistory( true );

	return screenshots;
};

function createHiddenWrapper() {
	const wrapper = document.createElement( 'div' );

	wrapper.style.position = 'absolute';
	wrapper.style.opacity = '0';

	elementor.getPreviewView().$childViewContainer[ 0 ].appendChild( wrapper );

	return wrapper;
}

function createContainers( models ) {
	return models.map( ( model ) => {
		return $e.run( 'document/elements/create', {
			container: elementor.getPreviewContainer(),
			model: generateIds( model ),
			options: {
				edit: false,
			},
		} );
	} );
}

function deleteContainers( containers ) {
	containers.forEach( ( container ) => {
		$e.run( 'document/elements/delete', {
			container,
		} );
	} );
}

function sleep( ms ) {
	return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
}

// Ensure that all elements have unique IDs since the Editor requires every element to have an ID.
function generateIds( container ) {
	container.id = elementorCommon.helpers.getUniqueId().toString();

	if ( container.elements?.length ) {
		container.elements.map( ( child ) => generateIds( child ) );
	}

	return container;
}

function wrapContainers( containers, wrapper ) {
	containers.forEach( ( container ) => {
		const el = container.view.$el[ 0 ];

		el.parentNode.insertBefore( wrapper, el );
		wrapper.appendChild( el );
	} );
}
