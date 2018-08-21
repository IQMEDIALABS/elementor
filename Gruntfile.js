module.exports = function( grunt ) {
	'use strict';

	var fs = require( 'fs' ),
		pkgInfo = grunt.file.readJSON( 'package.json' );

	require('load-grunt-tasks')(grunt);

	// Project configuration
	grunt.initConfig( {
		pkg: pkgInfo,

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("dd-mm-yyyy") %> */',

		checktextdomain: require( './.grunt-config/checktextdomain' ),
		usebanner: require( './.grunt-config/usebanner' ),
		sass: require( './.grunt-config/sass' ),
		postcss: require( './.grunt-config/postcss' ),
		watch:  require( './.grunt-config/watch' ),
		wp_readme_to_markdown: require( './.grunt-config/wp_readme_to_markdown' ),
		bumpup: require( './.grunt-config/bumpup' ),
		replace: require( './.grunt-config/replace' ),
		shell: require( './.grunt-config/shell' ),
		release: require( './.grunt-config/release' ),
		copy: require( './.grunt-config/copy' ),
		clean: require( './.grunt-config/clean' ),
		webpack: require( './.grunt-config/webpack' ),
		qunit: {
			src: 'tests/qunit/index.html'
		}
	} );

	// Default task(s).
	grunt.registerTask( 'default', [
		'i18n',
		'wp_readme_to_markdown',
		'scripts',
		'styles'
	] );

	grunt.registerTask( 'i18n', [
		'checktextdomain'
	] );

	grunt.registerTask( 'scripts', function( isDevMode ) {
		if ( ! isDevMode ) {
			grunt.task.run('webpack:prod');
		} else {
			grunt.task.run('webpack:dev');
		}
	} );

	grunt.registerTask( 'styles', function( isDevMode ) {
		grunt.task.run( 'sass' );

		if ( ! isDevMode ) {
			grunt.task.run( 'postcss' );
			grunt.task.run( 'css_templates' );
		}
	} );

	grunt.registerTask( 'css_templates', function() {
		grunt.task.run( 'css_templates_proxy:templates' );

		grunt.config( 'sass.dist', {
			files: [ {
				expand: true,
				cwd: 'assets/dev/scss/direction',
				src: [ 'frontend.scss', 'frontend-rtl.scss' ],
				dest: 'assets/css/templates',
				ext: '.css'
			} ]
		} );

		grunt.task.run( 'sass' );

		grunt.config( 'postcss.minify.files.0.src', [
			'assets/css/templates/*.css',
			'!assets/css/templates/*.min.css'
		] );

		grunt.task.run( 'postcss:minify' );

		grunt.task.run( 'css_templates_proxy:values' );
	} );

	// Writing the proxy file as a grunt task, in order to fit in with the tasks queue
	grunt.registerTask( 'css_templates_proxy', function( mode ) {
		fs.writeFileSync( 'assets/dev/scss/frontend/breakpoints/proxy.scss', '@import "' + mode + '";' );
	} );

	grunt.registerTask( 'build', [
		'default',
		'usebanner',
		'clean',
		'copy',
		'default' // Remove banners for GitHub
	] );

	grunt.registerTask( 'publish', function( releaseType ) {
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
		'qunit',
		'clean:qunit'
	] );
};
