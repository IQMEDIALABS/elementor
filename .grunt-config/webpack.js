/**
 * Grunt webpack task config
 * @package Elementor
 */
const path = require( 'path' );

const TerserPlugin = require( 'terser-webpack-plugin' );

const aliasList = require('./webpack.alias.js').resolve;

const webpack = require('webpack');

const jsToCss = require( './js-to-css.js' );

const moduleRules = ( env ) => {
	return {
		rules: [
			// {
			// 	enforce: 'pre',
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	loader: 'eslint-loader',
			// 	options: {
			// 		failOnError: true,
			// 	}
			// },
			{
				test: /core[/\\]app.*\.(s)?css$/i,
				use: [
					{
						loader: './loaders/app-imports.js',
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						query: {
							presets: [ '@wordpress/default' ],
							plugins: [
								[ '@wordpress/babel-plugin-import-jsx-pragma' ],
								[ '@babel/plugin-transform-react-jsx', {
									'pragmaFrag': 'React.Fragment',
								} ],
								[ 'babel-plugin-styled-components',	{
									'displayName': 'dev' === env,
								}
								],
								[ '@babel/plugin-proposal-class-properties' ],
								[ '@babel/plugin-transform-runtime' ],
								[ '@babel/plugin-transform-modules-commonjs' ],
								[ '@babel/plugin-proposal-optional-chaining' ],
							],
						},
					},
				],
			},
			{
				test:/e-style.*\.(s)?css$/i,
				use: [
					{
						loader: 'file-loader',
						options: { outputPath: '../css', name: 'e-style.css'}
					},
					'sass-loader',
				],
			},
		],
	};
};

const entry = {
	'editor': [
		path.resolve( __dirname, '../assets/dev/js/editor/utils/jquery-serialize-object.js' ),
		path.resolve( __dirname, '../assets/dev/js/editor/utils/jquery-html5-dnd.js' ),
		path.resolve( __dirname, '../assets/dev/js/editor/editor.js' ),
	],
	'admin': path.resolve( __dirname, '../assets/dev/js/admin/admin.js' ),
	'admin-bar': path.resolve( __dirname, '../modules/admin-bar/assets/js/frontend/module.js' ),
	'admin-feedback': path.resolve( __dirname, '../assets/dev/js/admin/admin-feedback.js' ),
	'common': path.resolve( __dirname, '../core/common/assets/js/common.js' ),
	'gutenberg': path.resolve( __dirname, '../assets/dev/js/admin/gutenberg.js' ),
	'new-template': path.resolve( __dirname, '../assets/dev/js/admin/new-template/new-template.js' ),
	'app': path.resolve( __dirname, '../core/app/assets/js/index.js' ),
	'app-loader': path.resolve( __dirname, '../core/app/assets/js/app-loader' ),
	'app-packages': path.resolve( __dirname, '../core/app/assets/js/app-packages' ),
	'beta-tester': path.resolve( __dirname, '../assets/dev/js/admin/beta-tester/beta-tester.js' ),
	'frontend': path.resolve( __dirname, '../assets/dev/js/frontend/frontend.js' ),
	'common-modules': path.resolve( __dirname, '../core/common/assets/js/modules' ),
	'editor-modules': path.resolve( __dirname, '../assets/dev/js/editor/modules.js' ),
	'editor-document': path.resolve( __dirname, '../assets/dev/js/editor/editor-document.js' ),
	'frontend-modules': path.resolve( __dirname, '../assets/dev/js/frontend/modules.js' ),
	'qunit-tests': path.resolve( __dirname, '../tests/qunit/main.js' ),
	'e-style': path.resolve( __dirname, '../assets/dev/scss/app/e-style.scss' ),
};

const externals = {
	'@wordpress/i18n': 'wp.i18n',
	react: 'React',
	'react-dom': 'ReactDOM',
	'@elementor/app-ui': 'elementorAppPackages.appUi',
	'@elementor/site-editor': 'elementorAppPackages.siteEditor',
	'@elementor/router': 'elementorAppPackages.router',
};

const plugins = [
	new jsToCss(),
	new webpack.ProvidePlugin( {
		React: 'react',
		ReactDOM: 'react-dom',
		PropTypes: 'prop-types',
		__: ['@wordpress/i18n', '__'],
		//styled: ['styled-components', 'default'],
		//css: ['styled-components', 'css'],
		//ThemeProvider: ['styled-components', 'ThemeProvider'],
		//_$: [ 'elementor-styles/style.js', 'default' ],
	} )
];

const baseConfig = {
	target: 'web',
	context: __dirname,
	devtool: 'source-map',
	externals,
	plugins,
	resolve: aliasList,
};

const webpackConfig = Object.assign( {}, baseConfig, {
	module: moduleRules( 'dev' ),
	mode: 'development',
	output: {
		path: path.resolve( __dirname, '../assets/js' ),
		filename: '[name].js',
		devtoolModuleFilenameTemplate: '../[resource]',
	},
	entry: entry,
	watch: true,
} );

const webpackProductionConfig = Object.assign( {}, baseConfig, {
	module: moduleRules( 'prod' ),
	mode: 'production',
	output: {
		path: path.resolve( __dirname, '../assets/js' ),
		filename: '[name].js',
	},
	entry: {},
	performance: { hints: false },
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin( {
				terserOptions: {
					keep_fnames: true,
				},
				include: /\.min\.js$/
			} ),
		],
	},
} );

// Add minified entry points
for ( const entryPoint in entry ) {
	webpackProductionConfig.entry[ entryPoint ] = entry[ entryPoint ];
	webpackProductionConfig.entry[ entryPoint + '.min' ] = entry[ entryPoint ];
}

const gruntWebpackConfig = {
	development: webpackConfig,
	production: webpackProductionConfig,
};

module.exports = gruntWebpackConfig;
