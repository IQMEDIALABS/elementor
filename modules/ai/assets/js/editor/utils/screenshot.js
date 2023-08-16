import { toCanvas } from 'html-to-image';
import { toggleHistory } from './history';
import { generateIds } from './genereate-ids';

export const takeScreenshots = async ( templates = [] ) => {
	// Disable history so the Editor won't show our hidden containers as user actions.
	toggleHistory( false );

	const hiddenWrapper = createHiddenWrapper();
	const containers = createContainers( templates );

	wrapContainers( containers, hiddenWrapper );

	elementor.getPreviewView().$childViewContainer[ 0 ].appendChild( hiddenWrapper );

	// Wait for the containers to render.
	await Promise.all( containers.map( ( { id } ) => waitForContainer( id ) ) );

	const promises = containers.map( ( { view } ) => screenshotNode( view.$el[ 0 ] ) );

	const screenshots = await Promise.allSettled( promises );

	deleteContainers( containers );

	hiddenWrapper.remove();

	toggleHistory( true );

	return screenshots.map( ( { status, value } ) => {
		// Return an empty image url if the screenshot failed.
		if ( 'rejected' === status ) {
			return '';
		}

		return value;
	} );
};

function screenshotNode( node ) {
	return toWebp( node, {
		quality: 0.01,
	} );
}

async function toWebp( node, options = {} ) {
	const canvas = await toCanvas( node, options );

	return canvas.toDataURL( 'image/webp', options.quality ?? 1 );
}

function createHiddenWrapper() {
	const wrapper = document.createElement( 'div' );

	wrapper.style.position = 'fixed';
	wrapper.style.opacity = '0';
	wrapper.style.inset = '0';

	return wrapper;
}

function createContainers( templates ) {
	return templates.map( ( template ) => {
		const model = generateIds( template );

		// Set a custom ID, so it can be used later on in the backend.
		model.id = `e-ai-screenshot-container-${ model.id }`;

		return $e.run( 'document/elements/create', {
			container: elementor.getPreviewContainer(),
			model,
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

function waitForContainer( id, timeout = 5000 ) {
	const timeoutPromise = sleep( timeout );

	const waitPromise = new Promise( ( resolve ) => {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', async ( $element ) => {
			if ( $element.data( 'id' ) === id ) {
				const images = [ ...$element[ 0 ].querySelectorAll( 'img' ) ];

				// Wait for all images to load.
				await Promise.all( images.map( waitForImage ) );

				resolve();
			}
		} );
	} );

	return Promise.any( [
		timeoutPromise,
		waitPromise,
	] );
}

function waitForImage( image ) {
	if ( image.complete ) {
		return Promise.resolve();
	}

	return new Promise( ( resolve ) => {
		image.addEventListener( 'load', resolve );

		image.addEventListener( 'error', () => {
			// Remove the image to make sure it won't break the screenshot.
			image.remove();

			resolve();
		} );
	} );
}

function sleep( ms ) {
	return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
}

function wrapContainers( containers, wrapper ) {
	containers.forEach( ( container ) => {
		const el = container.view.$el[ 0 ];

		el.parentNode.insertBefore( wrapper, el );
		wrapper.appendChild( el );
	} );
}
