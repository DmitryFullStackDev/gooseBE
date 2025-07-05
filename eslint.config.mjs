module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    // --- General TypeScript Rules ---
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_$' }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/brace-style': ['error', '1tbs'],
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
    '@typescript-eslint/prefer-for-of': 'warn',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/func-call-spacing': ['error', 'never'],
    '@typescript-eslint/no-parameter-properties': 'error',
    '@typescript-eslint/prefer-function-type': 'warn',

    // --- JS Rules ---
    'no-console': 'warn',
    'no-return-await': 'error',
    'no-template-curly-in-string': 'error',
    curly: ['error', 'all'],
    eqeqeq: ['error', 'smart'],
    'no-throw-literal': 'off',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'prefer-promise-reject-errors': 'error',
    radix: 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-shadow': 'off',
    'no-undef': 'off',

    // --- Code Style ---
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-infix-ops': 'error',
    'arrow-spacing': 'error',

    // --- Prettier ---
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
}
