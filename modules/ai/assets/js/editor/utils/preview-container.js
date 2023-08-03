import { toggleHistory } from './history';
import { generateIds } from './genereate-ids';

const PREVIEW_CONTAINER_ID = 'e-ai-preview-container';
const LOADING_CLASS = 'e-ai-preview-container--loading';
const IDLE_CLASS = 'e-ai-preview-container--idle';

/**
 * @param {{ at?: number }} options
 * @param {Object | null}   model
 *
 * @return {Object}
 */
export function createPreviewContainer( options = {}, model = null ) {
	toggleHistory( false );

	// When no model is supplied, create an empty Container. Used for UI purposes only.
	if ( ! model ) {
		model = {
			elType: 'container',
		};
	}

	const previewContainer = $e.run( 'document/elements/create', {
		container: elementor.getPreviewContainer(),
		model: {
			...model,
			id: PREVIEW_CONTAINER_ID,
		},
		options: {
			...options,
			edit: false,
		},
	} );

	toggleHistory( true );

	return previewContainer;
}

export function deletePreviewContainer() {
	toggleHistory( false );

	const container = getPreviewContainer();

	if ( container ) {
		$e.run( 'document/elements/delete', {
			container,
		} );
	}

	toggleHistory( true );
}

export function setPreviewContainerIdle() {
	const container = getPreviewContainer();

	if ( container ) {
		container.view.$el
			.removeClass( LOADING_CLASS )
			.addClass( IDLE_CLASS );
	}
}

export function setPreviewContainerLoading() {
	const container = getPreviewContainer();

	if ( container ) {
		container.view.$el
			.removeClass( IDLE_CLASS )
			.addClass( LOADING_CLASS );
	}
}

export function setPreviewContainerContent( template ) {
	const view = getPreviewContainer()?.view;

	if ( ! view ) {
		return;
	}

	const currentContainerPosition = view._index;

	deletePreviewContainer();

	createPreviewContainer(
		{ at: currentContainerPosition },
		generateIds( template ),
	);
}

function getPreviewContainer() {
	return elementor.getContainer( PREVIEW_CONTAINER_ID );
}
