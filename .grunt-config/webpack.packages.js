const path = require( 'path' );
const fs = require( 'fs' );
const { GenerateWordPressAssetFileWebpackPlugin } = require( '@elementor/generate-wordpress-asset-file-webpack-plugin' );
const { ExtractI18nWordpressExpressionsWebpackPlugin } = require( '@elementor/extract-i18n-wordpress-experssions-webpack-plugin' );
const { ExternalizeWordPressAssetsWebpackPlugin } = require( '@elementor/externalize-wordpress-assets-webpack-plugin' );

const { dependencies } = require( '../package.json' );

packages = Object.keys( dependencies )
	.filter( ( packageName ) => packageName.startsWith( '@elementor/' ) )
	.map( ( packageName ) => {
		const pkgJSON = fs.readFileSync( path.resolve( __dirname, `../node_modules/${packageName}/package.json` ) );

		const { main, module } = JSON.parse( pkgJSON );

		return {
		   mainFile: module || main,
		   packageName,
		}
	} )
	.filter( ( { mainFile } ) => !! mainFile )
	.map( ( { mainFile, packageName } ) => ( {
		name: packageName.replace( '@elementor/', '' ),
		path: path.resolve( __dirname, `../node_modules/${ packageName }`, mainFile ),
	} ) );

const common = {
	name: 'packages',
	entry: Object.fromEntries(
		packages.map( ( { name, path } ) => [ name, path ] )
	),
	plugins: [
		new GenerateWordPressAssetFileWebpackPlugin( { handlePrefix: 'elementor-packages-' } ),
		new ExternalizeWordPressAssetsWebpackPlugin( { globalKey: '__UNSTABLE__elementorPackages' } ),
	],
	output: {
		path: path.resolve( __dirname, '../assets/js/packages/' ),
	},
}

const devConfig = {
	...common,
	mode: 'development',
	devtool: false, // TODO: Need to check what to do with source maps.
	watch: true, // All the webpack config in the plugin that are dev, should have this property.
	output: {
		...( common.output || {} ),
		filename: '[name]/[name].js',
	}
}

const prodConfig = {
	...common,
	mode: 'production',
	devtool: false, // TODO: Need to check what to do with source maps.
	optimization: {
		...( common.optimization || {} ),
		minimize: true,
	},
	plugins: [
		...( common.plugins || [] ),
		new ExtractI18nWordpressExpressionsWebpackPlugin(),
	],
	output: {
		...( common.output || {} ),
		filename: '[name]/[name].min.js',
	}
}

module.exports = {
	dev: devConfig,
	prod: prodConfig,
};
