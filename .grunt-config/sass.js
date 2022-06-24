var sassImplementation = require('sass');

const sass = {
	dist: {
		options: {
			sourceMap: true,
			precision: 5,
			implementation: sassImplementation,
		},
		files: [
			{
				expand: true,
				cwd: 'assets/dev/scss/direction',
				src: '*.scss',
				dest: 'assets/css',
				ext: '.css'
			},
			{
				expand: true,
				cwd: 'modules/container-converter/assets/scss',
				src: 'editor.scss',
				dest: 'assets/css/modules/container-converter',
				ext: '.css',
			},
		]
	}
};

module.exports = sass;
