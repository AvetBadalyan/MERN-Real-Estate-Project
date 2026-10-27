import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
	js.configs.recommended,
	prettier,
	{
		files: ['backend/**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: { ...globals.node },
		},
		rules: {
			'no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
			'no-duplicate-imports': 'error',
		},
	},
]
