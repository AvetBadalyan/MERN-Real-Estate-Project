import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
	{ ignores: ['dist'] },
	js.configs.recommended,
	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	prettier,
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser },
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		settings: { react: { version: '18.2' } },
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			// React Hooks — classic rules (match the prior v4 recommended scope)
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// React
			'react/jsx-no-target-blank': 'off',
			'react/prop-types': 'off',
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],

			// Best practice
			'no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
			'no-duplicate-imports': 'error',
		},
	},
]
