module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended-with-formatting',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	settings: {
		'import/internal-regex': '^@elementor/',
		'import/resolver': {
			node: {
				extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
			},
		},
	},
	overrides: [
		{
			// Development files.
			files: [
				'**/@(__mocks__|__tests__|test)/**/*.[tj]s?(x)',
			],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
};
