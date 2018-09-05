module.exports = {
	extends: [
		'wordpress',
		'plugin:wordpress/esnext',
		//'plugin:react/recommended',
	],
	plugins: [
		'wordpress',
		//'react',
	],
	globals: {
		wp: true,
		window: true,
		document: true,
		'_': false,
		'jQuery': false,
		'JSON': false,
		elementorFrontend: true,
		require: true,
		elementor: true,
		DialogsManager: true,
		module: true,
	},
	'parserOptions': {
		'sourceType': 'module',
	},
	rules: {
		// custom canceled rules
		'no-var': 'off',
		'vars-on-top': 'off',
		'wrap-iife': 'off',
		'computed-property-spacing': 'off',
		'comma-dangle': 'off',
		'no-undef': 'off',
		'no-unused-vars': 'warn',
		'dot-notation': 'warn',
		'no-shadow': 'warn',
		'no-lonely-if': 'warn',
		'no-cond-assign': 'warn',
		'space-in-parens': [ 'off', 'always' ],
		'no-multi-spaces': 'warn',
		'semi-spacing': 'warn',
		'quote-props': [ 'warn', 'as-needed' ],
		indent: [ 'off', 'tab', { SwitchCase: 1 } ],
		'no-mixed-spaces-and-tabs': 'warn',
		'padded-blocks': [ 'warn', 'never' ],
		'one-var-declaration-per-line': 'warn',
		'no-extra-semi': 'warn',
		'key-spacing': 'warn',
		'array-bracket-spacing': [ 'warn', 'always' ],
		'no-else-return': 'warn',
		'no-console': 'warn',
		//end of custom canceled rules
		'arrow-spacing': 'error',
		'brace-style': [ 'error', '1tbs' ],
		camelcase: [ 'error', { properties: 'never' } ],
		'comma-spacing': 'error',
		'comma-style': 'error',
		'eol-last': 'error',
		eqeqeq: 'error',
		'func-call-spacing': 'error',
		'jsx-quotes': 'error',
		'keyword-spacing': 'error',
		'lines-around-comment': 'off',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-debugger': 'error',
		'no-dupe-args': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-eval': 'error',
		'no-fallthrough': 'error',
		'no-multiple-empty-lines': [ 'warn', { max: 1 } ],
		'no-multi-str': 'off',
		'no-negated-in-lhs': 'error',
		'no-redeclare': 'error',
		'no-restricted-syntax': [
			'error',
			{
				selector: 'CallExpression[callee.name=/^__|_n|_x$/]:not([arguments.0.type=/^Literal|BinaryExpression$/])',
				message: 'Translate function arguments must be string literals.',
			},
			{
				selector: 'CallExpression[callee.name=/^_n|_x$/]:not([arguments.1.type=/^Literal|BinaryExpression$/])',
				message: 'Translate function arguments must be string literals.',
			},
			{
				selector: 'CallExpression[callee.name=_nx]:not([arguments.2.type=/^Literal|BinaryExpression$/])',
				message: 'Translate function arguments must be string literals.',
			},
		],
		'no-trailing-spaces': 'warn',
		'no-undef-init': 'error',
		'no-unreachable': 'error',
		'no-unsafe-negation': 'error',
		'no-unused-expressions': 'error',
		'no-useless-return': 'error',
		'no-whitespace-before-property': 'error',
		'object-curly-spacing': [ 'error', 'always' ],
		'prefer-const': 'warn',
		quotes: [ 'error', 'single', { allowTemplateLiterals: true, avoidEscape: true } ],
		semi: 'error',
		'space-before-blocks': [ 'error', 'always' ],
		'space-before-function-paren': [ 'error', {
			anonymous: 'never',
			named: 'never',
			asyncArrow: 'always',
		} ],
		'space-infix-ops': [ 'error', { int32Hint: false } ],
		'space-unary-ops': [ 'error', {
			overrides: {
				'!': true,
				yield: true,
			},
		} ],
		'valid-typeof': 'error',
		yoda: 'off',
		// 'react/display-name': 'off',
		// 'react/jsx-curly-spacing': [ 'error', {
		// 	when: 'always',
		// 	children: true,
		// } ],
		// 'react/jsx-equals-spacing': 'error',
		// 'react/jsx-indent': [ 'error', 'tab' ],
		// 'react/jsx-indent-props': [ 'error', 'tab' ],
		// 'react/jsx-key': 'error',
		// 'react/jsx-tag-spacing': 'error',
		// 'react/no-children-prop': 'off',
		// 'react/prop-types': 'off',
		// 'react/react-in-jsx-scope': 'off',
	},
};
