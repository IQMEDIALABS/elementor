import FileReader from '../file-reader';

export class Json extends FileReader {
	/**
	 * @inheritDoc
	 */
	static getName() {
		return 'json';
	}

	/**
	 * @inheritDoc
	 */
	static get mimeTypes() {
		return [ 'application\\/json' ];
	}

	/**
	 * @inheritDoc
	 */
	static async resolve( input ) {
		try {
			JSON.parse( input );

			return 'application/json';
		} catch ( e ) {
			return false;
		}
	}

	/**
	 * Returns the file content as Json object.
	 *
	 * @returns {{}}
	 */
	getData() {
		return this.getContent()
			.then( ( content ) => JSON.parse( content ) );
	}
}
