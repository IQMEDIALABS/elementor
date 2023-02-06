import { V1Document } from '../../types';

export function dispatchCommandBefore( command: string, args: object = {} ) {
	window.dispatchEvent( new CustomEvent( 'elementor/commands/run/before', {
		detail: {
			command,
			args,
		},
	} ) );
}

export function dispatchCommandAfter( command: string, args: object = {} ) {
	window.dispatchEvent( new CustomEvent( 'elementor/commands/run/after', {
		detail: {
			command,
			args,
		},
	} ) );
}

export function dispatchWindowEvent( event: string ) {
	window.dispatchEvent( new CustomEvent( event ) );
}

export function dispatchV1ReadyEvent() {
	dispatchWindowEvent( 'elementor/v1/initialized' );
}

export function makeDocumentsManager( documentsArray: V1Document[], current = 1 ) {
	const documents = documentsArray.reduce( ( acc: Record<number, V1Document>, document ) => {
		acc[ document.id ] = document;

		return acc;
	}, {} );

	return {
		documents,
		getCurrentId() {
			return current;
		},
		getCurrent() {
			return this.documents[ this.getCurrentId() ];
		},
	};
}

export function makeMockV1Document( id = 1 ): V1Document {
	return {
		id,
		config: {
			type: 'page',
			user: {
				can_publish: true,
			},
			revisions: {
				current_id: id,
			},
		},
		editor: {
			isChanged: false,
			isSaving: false,
		},
		container: {
			settings: makeV1Settings( {
				post_title: 'Document ' + id,
				post_status: 'publish',
			} ),
		},
	};
}

export function makeV1Settings<T extends object>( settings: T ) {
	return {
		get( key: keyof T ) {
			return settings[ key ];
		},
	} as V1Document['container']['settings'];
}
