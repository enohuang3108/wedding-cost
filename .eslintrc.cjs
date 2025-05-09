/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        '@remix-run/eslint-config',
    ],
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
    rules: {
        'max-len': ['warn', { code: 100 }],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-multiple-empty-lines': ['error', {
            max: 1,
            maxEOF: 0,
            maxBOF: 0
        }],
        'indent': ['error', 4, { SwitchCase: 1 }],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
