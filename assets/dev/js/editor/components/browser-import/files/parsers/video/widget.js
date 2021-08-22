import FileParserBase from '../../file-parser-base';

export class Widget extends FileParserBase {
	/**
	 * @inheritDoc
	 */
	static getName() {
		return 'widget';
	}

	/**
	 * @inheritDoc
	 */
	static getReaders() {
		return [ 'video' ];
	}

	/**
	 * @inheritDoc
	 */
	async parse() {
		const file = this.reader.getFile();

		return $e.data.run( 'create', 'wp/media', { file, options: {} } )
			.then( ( { data: result } ) => {
				this.session.getTarget().createElement( 'video', {
					settings: {
						video_type: 'hosted',
						insert_url: 'yes',
						external_url: {
							url: result.source_url,
							is_external: '',
							nofollow: '',
							custom_attributes: '',
						},
					},
				} );
			} );
	}

	/**
	 * @inheritDoc
	 */
	static async validate( reader ) {
		return true;
	}
}
