module.exports = {
	root: true,
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:@wordpress/eslint-plugin/recommended-with-formatting',
		'plugin:import/typescript',
	],
	plugins: [
		'react',
		'@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	rules: {
		'computed-property-spacing': [ 'error', 'always' ],
		'comma-dangle': [ 'error', 'always-multiline' ],
		'no-undef': 'off',
		'dot-notation': 'error',
		'no-shadow': 'error',
		'no-lonely-if': 'error',
		'no-mixed-operators': 'error',
		'no-nested-ternary': 'error',
		'no-cond-assign': 'error',
		'no-unused-vars': 'off', // Using the @typescript-eslint/no-unused-vars rule instead.
		indent: [ 'off', 'tab', { SwitchCase: 1 } ],
		'padded-blocks': [ 'error', 'never' ],
		'one-var-declaration-per-line': 'error',
		'array-bracket-spacing': [ 'error', 'always' ],
		'no-else-return': 'error',
		'arrow-parens': [ 'error', 'always' ],
		'brace-style': [ 'error', '1tbs' ],
		'jsx-quotes': 'error',
		'no-bitwise': [ 'error', { allow: [ '^' ] } ],
		'no-caller': 'error',
		'no-eval': 'error',
		yoda: [ 'error', 'always', {
			onlyEquality: true,
		} ],
		'capitalized-comments': [
			'error',
			'always',
			{
				ignoreConsecutiveComments: true,
			},
		],
		'spaced-comment': [ 'error', 'always', { markers: [ '!' ] } ],
	},
};
