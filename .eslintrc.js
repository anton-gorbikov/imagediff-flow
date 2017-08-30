module.exports = {
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 6
	},
	env: {
		node: true,
		browser: true,
		commonjs: true,
		jquery: true
	},
	globals: {
		d3: true,
		_: true
	},
	rules: {
		// Possible Errors section.
		'no-extra-parens': ['error', 'all'],
		'no-unsafe-negation': 'error',
		'valid-jsdoc': 'error',

		// Best Practices section.
		'array-callback-return': 'error',
		'block-scoped-var': 'error',
		'class-methods-use-this': 'error',
		'complexity': ['error', 5],
		'consistent-return': 'error',
		'curly': 'error',
		'default-case': 'error',
		'dot-location': ['error', 'property'],
		'dot-notation': 'off', // TODO
		'eqeqeq': 'error',
		'guard-for-in': 'error',
		'no-alert': 'error',
		'no-caller': 'error',
		'no-else-return': 'error',
		'no-empty-function': 'error',
		'no-eq-null': 'error',
		'no-eval': 'error',
		'no-extend-native': 'error',
		'no-extra-bind': 'error',
		'no-extra-label': 'error',
		'no-floating-decimal': 'error',
		'no-global-assign': 'error',
		'no-implicit-coercion': 'off',
		'no-implicit-globals': 'error',
		'no-implied-eval': 'error',
		'no-invalid-this': 'error',
		'no-iterator': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-loop-func': 'error',
		'no-magic-numbers': ['error', { 'ignore': [-1, 1] }],
		'no-multi-spaces': 'error',
		'no-multi-str': 'error',
		'no-new-func': 'error',
		'no-new-wrappers': 'error',
		'no-new': 'error',
		'no-octal-escape': 'error',
		'no-param-reassign': 'error',
		'no-proto': 'error',
		'no-return-assign': 'error',
		'no-script-url': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-throw-literal': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-unused-expressions': 'error',
		'no-useless-call': 'error',
		'no-useless-concat': 'error',
		'no-useless-escape': 'error',
		'no-void': 'error',
		'no-warning-comments': 'off', // TODO
		'no-with': 'error',
		'radix': 'error',
		'vars-on-top': 'error',
		'wrap-iife': ['error', 'inside'],
		'yoda': ['error', 'never'],

		// Strict Mode section.
		'strict': ['error', 'safe'],

		// Variables section.
		'init-declarations': ['error', 'always'],
		'no-catch-shadow': 'error',
		'no-label-var': 'error',
		'no-restricted-globals': 'off', // OK
		'no-shadow-restricted-names': 'error',
		'no-shadow': 'off', // OK
		'no-undef-init': 'error',
		'no-undefined': 'error',
		'no-use-before-define': ['error', { 'functions': false }],

		// Node.js and CommonJS section.
		'callback-return': 'error',
		'global-require': 'error',
		'handle-callback-err': 'error',
		'no-mixed-requires': 'error',
		'no-new-require': 'error',
		'no-path-concat': 'error',
		'no-process-env': 'error',
		'no-process-exit': 'error',
		'no-restricted-modules': 'off', // OK
		'no-sync': 'off', // OK

		// Stylistic Issues section.
		'array-bracket-spacing': ['error', 'never'],
		'block-spacing': ['error', 'always'],
		'brace-style': ['error', '1tbs'],
		'camelcase': ['error', { 'properties': 'always' }],
		'comma-dangle': ['error', 'never'],
		'comma-spacing': ['error', { 'before': false, 'after': true }],
		'comma-style': ['error', 'last'],
		'computed-property-spacing': ['error', 'never'],
		'consistent-this': ['error', 'that'],
		'eol-last': 'error',
		'func-call-spacing': ['error', 'never'],
		'func-names': ['error', 'never'],
		'func-style': ['error', 'declaration'],
		'id-blacklist': 'off', // TODO
		'id-length': 'off', // TODO
		'id-match': 'off', // TODO
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'jsx-quotes': 'off', // OK
		'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true, 'mode': 'strict' }],
		'keyword-spacing': ['error', { 'before': true, 'after': true }],
		'linebreak-style': ['off'], // OK
		'lines-around-comment': ['error', { 'beforeBlockComment': true }],
		'max-depth': ['error', 4],
		'max-len': 'off', // OK
		'max-lines': 'off', // OK
		'max-nested-callbacks': ['error', 3],
		'max-params': ['error', 5],
		'max-statements-per-line': ['error', { 'max': 1 }],
		'max-statements': ['error', 10],
		'multiline-ternary': ['error', 'never'],
		'new-cap': 'error',
		'new-parens': 'error',
		'newline-after-var': 'error',
		'newline-before-return': 'error',
		'newline-per-chained-call': 'error',
		'no-array-constructor': 'error',
		'no-bitwise': 'error',
		'no-continue': 'error',
		'no-inline-comments': 'error',
		'no-lonely-if': 'error',
		'no-mixed-operators': 'error',
		'no-multiple-empty-lines': 'error',
		'no-negated-condition': 'off', // OK
		'no-nested-ternary': 'error',
		'no-new-object': 'error',
		'no-plusplus': 'off', // OK
		'no-restricted-syntax': 'off', // OK
		'no-tabs': 'off', // OK
		'no-ternary': 'off', // OK
		'no-trailing-spaces': 'error',
		'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
		'no-unneeded-ternary': 'error',
		'no-whitespace-before-property': 'error',
		'object-curly-newline': 'off', // OK
		'object-curly-spacing': ['error', 'always'],
		'object-property-newline': 'off', // OK
		'one-var-declaration-per-line': ['error', 'initializations'],
		'one-var': 'off',
		'operator-assignment': ['error', 'always'],
		'operator-linebreak': ['error', 'after'],
		'padded-blocks': ['error', 'never'],
		'quote-props': ['error', 'as-needed'],
		'quotes': ['error', 'single'],
		'require-jsdoc': 'off', // OK
		'semi-spacing': ['error', { 'before': false, 'after': true }],
		'semi': ['error', 'always'],
		'sort-keys': 'off', // OK
		'sort-vars': 'off', // OK
		'space-before-blocks': 'error',
		'space-before-function-paren': ['error', 'never'],
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': 'off', // OK
		'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
		'spaced-comment': ['error', 'always'],
		'unicode-bom': ['error', 'never'],
		'wrap-regex': 'off', // OK

		// ECMAScript 6 section.
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-parens': ['error', 'always'],
		'arrow-spacing': ['error', { 'before': true, 'after': true }],
		'generator-star-spacing': ['error', { 'before': false, 'after': true }],
		'no-confusing-arrow': 'off', // OK
		'no-duplicate-imports': 'error',
		'no-restricted-imports': 'off', // OK
		'no-useless-computed-key': 'error',
		'no-useless-constructor': 'error',
		'no-useless-rename': 'error',
		'no-var': 'off', // OK
		'object-shorthand': 'off', // OK
		'prefer-arrow-callback': 'off', // OK
		'prefer-const': 'off', // OK
		'prefer-reflect': 'off', // OK
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'prefer-template': 'error',
		'rest-spread-spacing': ['error', 'never'],
		'sort-imports': 'off', // OK
		'symbol-description': 'error',
		'template-curly-spacing': ['error', 'never'],
		'yield-star-spacing': ['error', { 'before': false, 'after': true }]
	}
};
