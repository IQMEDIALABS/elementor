import fs from 'fs';
import { type APIRequestContext } from '@playwright/test';
import { Image, Post, WpPage } from '../types/types';

export default class ApiRequests {
	private readonly nonce: string;
	constructor( nonce: string ) {
		this.nonce = nonce;
	}

	public async create( request: APIRequestContext, entity: string, data: Post ) {
		const response = await request.post( '/index.php', {
			params: { rest_route: `/wp/v2/${ entity }` },
			headers: {
				'X-WP-Nonce': this.nonce,
			},
			multipart: data,
		} );

		if ( ! response.ok() ) {
			throw new Error( `
				Failed to create a ${ entity }: ${ response.status() }.
				${ await response.text() }
				${ response.url() }
				TEST_PARALLEL_INDEX: ${ process.env.TEST_PARALLEL_INDEX }
				NONCE: ${ this.nonce }
			` );
		}
		const { id } = await response.json();

		return id;
	}

	public async createDefaultMedia( request: APIRequestContext, image: Image ) {
		const imagePath = image.filePath;
		const response = await request.post( '/index.php', {

			params: { rest_route: '/wp/v2/media' },
			headers: {
				'X-WP-Nonce': this.nonce,
			},
			multipart: {
				file: fs.createReadStream( imagePath ),
				title: image.title,
				status: 'publish',
				description: image.description,
				alt_text: image.alt_text,
				caption: image.caption,
			},
		} );

		if ( ! response.ok() ) {
			throw new Error( `
			Failed to create default media: ${ response.status() }.
			${ await response.text() }
		` );
		}

		const { id } = await response.json();

		return id;
	}

	public async deleteDefaultMedia( request: APIRequestContext, ids: string[] ) {
		const requests = [];
		for ( const id in ids ) {
			requests.push( request.delete( `/index.php`, {
				headers: {
					'X-WP-Nonce': this.nonce,
				},
				params: {
					rest_route: `/wp/v2/media/${ ids[ id ] }`,
					force: 1,
				},
			} ) );
		}
		await Promise.all( requests );
	}

	public async cleanUpTestPages( request: APIRequestContext ) {
		const pagesPublished = await this.getPages( request ),
			pagesDraft = await this.getPages( request, 'draft' ),
			pages = [ ...pagesPublished, ...pagesDraft ];

		const pageIds = pages
			.filter( ( page: WpPage ) => page.title.rendered.includes( 'Playwright Test Page' ) )
			.map( ( page: WpPage ) => page.id );

		for ( const id of pageIds ) {
			await this.deletePage( request, id );
		}
	}

	private async get( request: APIRequestContext, entity: string, status: string = 'publish' ) {
		const response = await request.get( '/index.php', {
			params: {
				rest_route: `/wp/v2/${ entity }`,
				status,
			},
			headers: {
				'X-WP-Nonce': this.nonce,
			},
		} );

		if ( ! response.ok() ) {
			throw new Error( `
			Failed to get a ${ entity }: ${ response.status() }.
			${ await response.text() }
		` );
		}
		return await response.json();
	}

	private async getPages( request: APIRequestContext, status: string = 'publish' ) {
		return await this.get( request, 'pages', status );
	}

	private async deletePage( request: APIRequestContext, pageId: string ) {
		await this._delete( request, 'pages', pageId );
	}

	private async _delete( request: APIRequestContext, entity: string, id: string ) {
		const response = await request.delete( '/index.php', {
			params: { rest_route: `/wp/v2/${ entity }/${ id }` },
			headers: {
				'X-WP-Nonce': this.nonce,
			},
		} );

		if ( ! response.ok() ) {
			throw new Error( `
			Failed to delete a ${ entity }: ${ response.status() }.
			${ await response.text() }
		` );
		}
	}
}
