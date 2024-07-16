module.exports = function( grunt ) {
	'use strict';

	const fs = require( 'fs' ),
		pkgInfo = grunt.file.readJSON( 'package.json' ),
		WidgetsCss = require( './.grunt-config/widgets-css' ),
		ModulesWithWidgetsCss = require( './.grunt-config/modules-with-widgets-css' ),
		Eicons = require( './.grunt-config/eicons' );

	const widgetsCss = new WidgetsCss( 'production' ),
		modulesWidgetsCss = new ModulesWithWidgetsCss( 'production' ),
		eicons = new Eicons();

	require( 'load-grunt-tasks' )( grunt );

	// Project configuration
	grunt.initConfig( {
		pkg: pkgInfo,

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("dd-mm-yyyy") %> */',

		checktextdomain: require( './.grunt-config/checktextdomain' ),
		usebanner: require( './.grunt-config/usebanner' ),
		sass: require( './.grunt-config/sass' ),
		postcss: require( './.grunt-config/postcss' ),
		watch: require( './.grunt-config/watch' ),
		bumpup: require( './.grunt-config/bumpup' ),
		replace: require( './.grunt-config/replace' ),
		shell: require( './.grunt-config/shell' ),
		release: require( './.grunt-config/release' ),
		copy: require( './.grunt-config/copy' ),
		clean: require( './.grunt-config/clean' ),
		webpack: require( './.grunt-config/webpack' ),
		karma: require( './.grunt-config/karma' ),
	} );

	// Default task(s).
	grunt.registerTask( 'default', [
		'i18n',
		'scripts',
		'styles',
	] );

	// Widgets.
	grunt.registerTask( 'create_widgets_temp_scss_files', () => widgetsCss.createWidgetsTempScssFiles() );
	grunt.registerTask( 'remove_widgets_unused_style_files', () => widgetsCss.removeWidgetsUnusedStyleFiles() );

	// Modules with Widgets.
	grunt.registerTask( 'create_modules_widgets_temp_scss_files', () => modulesWidgetsCss.createWidgetsTempScssFiles() );
	grunt.registerTask( 'remove_modules_widgets_unused_style_files', () => modulesWidgetsCss.removeWidgetsUnusedStyleFiles() );

	grunt.registerTask( 'create_eicons_frontend_js_file', () => eicons.createFrontendIconsFile() );

	grunt.registerTask( 'i18n', [
		'checktextdomain',
	] );

	grunt.registerTask( 'scripts', ( isDevMode = false ) => {
		const taskName = isDevMode ? 'webpack:development' : 'webpack:production';

		grunt.task.run( 'create_eicons_frontend_js_file' );

		if ( ! isDevMode ) {
			grunt.task.run( 'webpack:developmentNoWatch' );
		}

		grunt.task.run( taskName );
	} );

	grunt.registerTask( 'watch_scripts', () => {
		grunt.task.run( 'webpack:development' );
	} );

	grunt.registerTask( 'watch_scripts:production', () => {
		grunt.task.run( 'webpack:productionWatch' );
	} );

	grunt.registerTask( 'scripts:packages', () => {
		grunt.task.run( 'webpack:packages' );
	} );

	grunt.registerTask( 'styles', ( isDevMode = false ) => {
		if ( ! isDevMode ) {
			grunt.task.run( 'create_widgets_temp_scss_files' );
			grunt.task.run( 'create_modules_widgets_temp_scss_files' );
		}

		grunt.task.run( 'sass' );

		if ( ! isDevMode ) {
			grunt.task.run( 'postcss' );
			grunt.task.run( 'css_templates' );

			grunt.task.run( 'remove_widgets_unused_style_files' );
			grunt.task.run( 'remove_modules_widgets_unused_style_files' );
		}
	} );

	grunt.registerTask( 'watch_styles', () => {
		grunt.task.run( 'watch:styles' );
	} );

	grunt.registerTask( 'css_templates', () => {
		grunt.task.run( 'css_templates_proxy:templates' );

		const responsiveWidgetsList = widgetsCss.getResponsiveWidgetsList(),
			responsiveModulesWidgetsList = modulesWidgetsCss.getResponsiveWidgetsList();

		grunt.config( 'sass.dist', {
			files: [ {
				expand: true,
				cwd: 'assets/dev/scss/direction',
				src: [
					'frontend.scss',
					'frontend-rtl.scss',
					'frontend-lite.scss',
					'frontend-lite-rtl.scss',
					'frontend-legacy.scss',
					'frontend-legacy-rtl.scss',
					...responsiveWidgetsList,
					...responsiveModulesWidgetsList,
				],
				dest: 'assets/css/templates',
				ext: '.css',
			} ],
		} );

		grunt.task.run( 'sass' );

		grunt.config( 'postcss.minify.files.0.src', [
			'assets/css/templates/*.css',
			'!assets/css/templates/*.min.css',
		] );

		grunt.task.run( 'postcss:minify' );

		grunt.task.run( 'css_templates_proxy:values' );
	} );

	// Writing the proxy file as a grunt task, in order to fit in with the tasks queue
	grunt.registerTask( 'css_templates_proxy', ( mode ) => {
		fs.writeFileSync( 'assets/dev/scss/frontend/breakpoints/proxy.scss', '@import "' + mode + '";' );
	} );

	grunt.registerTask( 'build', [
		'default',
		'usebanner',
		'clean',
		'copy',
	] );

	grunt.registerTask( 'publish', ( releaseType ) => {
		releaseType = releaseType ? releaseType : 'patch';

		var prevStableVersion = 'patch' === releaseType ? pkgInfo.prev_stable_version : pkgInfo.version;

		grunt.config.set( 'prev_stable_version', prevStableVersion );

		grunt.task.run( 'default' );
		grunt.task.run( 'bumpup:' + releaseType );
		grunt.task.run( 'replace' );
		grunt.task.run( 'shell:git_add_all' );
		grunt.task.run( 'release' );
	} );

	grunt.registerTask( 'test', [
		'karma:unit',
	] );
};
