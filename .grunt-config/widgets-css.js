const path = require( 'path' );
const fs = require( 'fs' );
const write = require('write');

class WidgetsCss {
	constructor( env ) {
		this.env = env;

		this.tempFilePrefix = '000-' + env + '-';

		this.widgetsFolder = path.resolve( __dirname, '../includes/widgets' );
		this.widgetsScssSourceFolder = path.resolve( __dirname, '../assets/dev/scss/frontend/widgets' );
		this.widgetsScssFolder = path.resolve( __dirname, '../assets/dev/scss/direction' );
		this.widgetsCssFolder = path.resolve( __dirname, '../assets/css' );
	}

	apply( compiler ) {
		compiler.hooks.environment.tap( 'WidgetsCss', () => this.createWidgetsTempFiles() );

		compiler.hooks.done.tap( 'WidgetsCss', () => {
			this.injectCss();
			this.removeWidgetsTempFiles();
		} );
	}

	createWidgetsTempFiles() {
		console.log( '------------------------ creating widgets temp files with prefix: ', this.tempFilePrefix );
		if ( fs.existsSync( this.widgetsScssSourceFolder ) ) {
			fs.readdirSync( folder ).forEach( ( fileName ) => {
				for ( const fileName of files ) {
					const widgetName = fileName.replace( '.scss', '' ),
						widgetScssFileDest = path.join( this.widgetsScssFolder, this.tempFilePrefix + fileName ),
						widgetScssRtlFileDest = path.join( this.widgetsScssFolder, this.tempFilePrefix + fileName.replace( '.scss', '-rtl.scss' ) );

					write.sync( widgetScssFileDest, this.getWidgetScssContent( widgetName, 'ltr' ) );
					write.sync( widgetScssRtlFileDest, this.getWidgetScssContent( widgetName, 'rtl' ) );
				}
			} );
		}
	}

	getWidgetScssContent( widgetName, direction ) {
		return `$direction: ${ direction };

@import "../helpers/direction";

@import "../../../../assets/dev/scss/helpers/variables";
@import "../../../../assets/dev/scss/helpers/mixins";
@import "../../../../assets/dev/scss/editor/breakpoints";
@import "../../../../assets/dev/scss/frontend/breakpoints/values";
@import "../../../../assets/dev/scss/frontend/breakpoints/templates";
@import "../../../../assets/dev/scss/frontend/breakpoints/breakpoints";

@import "../frontend/widgets/${ widgetName }";
		`;
	}

	removeFile( filePath ) {
		fs.unlink( filePath, err => {
			if ( err ) throw err;
		} );
	}

	injectCss() {
		console.log( '------------------------------------------------------ INJECTING CSS from: ', this.tempFilePrefix );
		const cssFolder = path.resolve( __dirname, '../assets/css' );

		if ( fs.existsSync( this.widgetsFolder ) ) {
			fs.readdirSync( this.widgetsFolder ).forEach( ( fileName ) => {
				const widgetFilePath = path.join( this.widgetsFolder, fileName );
				let widgetContent = fs.readFileSync( widgetFilePath, 'utf8' );

				// Getting the content inside the InjectCSS tags (<InjectCSS:widgetName></InjectCSS>).
				let widgetInjectCssContent = widgetContent.match( /\/\* <\InjectCss:[^]+?<\/InjectCss> \*\// );

				if ( widgetInjectCssContent ) {
					widgetInjectCssContent = widgetInjectCssContent[ 0 ];

					// Getting the value inside the InjectCSS tag (<InjectCSS:*widgetName*>).
					const widgetName = widgetInjectCssContent.match( /\/\* <InjectCss:[^]+?(?=>)/ )[ 0 ].replace( '/* <InjectCss:', '' ),
						fileMinSuffix = 'development' === this.env ? '' : '.min',
						cssFilePath = path.join( cssFolder, this.tempFilePrefix + widgetName + fileMinSuffix + '.css' );

					console.log( 'Checking if exist cssFilePath', cssFilePath );
					if ( fs.existsSync( cssFilePath ) ) {
						console.log( 'YES - INJECTING!!!' );
						const cssFileContent = fs.readFileSync( cssFilePath, 'utf8' ),
							cssContent = cssFileContent.replace( /(\r\n|\n|\r|\t)/gm, '' ),
							phpContent = `/* <InjectCss:${ widgetName }> */
			if ( $this->is_widget_css() ) {
				echo '<style>${ cssContent }</style>';
			}
		/* </InjectCss> */`;

						widgetContent = widgetContent.replace( widgetInjectCssContent, phpContent );

						write.sync( widgetFilePath, widgetContent );
					} else {
						console.log( 'FILE does not exist' );
					}
				}
			} );
		}
	}

	removeWidgetsTempFiles() {
		console.log( '------------------------------------------------------ REMOVING TEMP FILES: ', this.tempFilePrefix );
		const tempFilesFolders = [ this.widgetsScssFolder, this.widgetsCssFolder ];

		tempFilesFolders.forEach( ( folder ) => {
			if ( fs.existsSync( folder ) ) {
				fs.readdirSync( folder ).forEach( ( fileName ) => {
					const filePath = path.join( folder, fileName );

					if ( -1 !== fileName.indexOf( this.tempFilePrefix ) && fs.existsSync( filePath ) ) {
						fs.unlink( filePath, err => {
							if ( err ) throw err;
						} );
					}
				} );
			}
		} );
	}
}

module.exports = WidgetsCss;
