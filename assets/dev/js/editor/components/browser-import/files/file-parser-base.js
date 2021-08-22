import Container from '../../../container/container';

/**
 * @abstract
 */
export default class FileParserBase {
	/**
	 * The file-reader instance.
	 *
	 * @type {FileReaderBase}
	 */
	reader;

	/**
	 * FileParseBase constructor.
	 *
	 * @param reader
	 */
	constructor( reader ) {
		this.reader = reader;
	}

	/**
	 * Get the file-parser name.
	 *
	 * @abstract
	 * @returns {string}
	 */
	static getName() {
		return '';
	}

	/**
	 * Get all readers the parser can handle with.
	 *
	 * @abstract
	 * @returns {string[]}
	 */
	static getReaders() {
		return [];
	}

	/**
	 * Parse the the input as needed by this parser, and return Container objects to be processed.
	 *
	 * @abstract
	 * @returns {Container[]}
	 */
	async parse() {}

	/**
	 * Here parsers can validate that an input from a reader can be handled by the parser. This validation has to be
	 * very accurate and specific so if the parser can't handle the file for sure, the next parsers will have the
	 * opportunity to do so.
	 *
	 * @abstract
	 * @returns {boolean}
	 */
	static async validate( reader ) {
		return false;
	}

	/**
	 * Creates a new Container object.
	 *
	 * @param args
	 * @returns {Container}
	 */
	createContainer( args ) {
		return new Container( args );
	}
}
