module.exports = {
  parser: '@typescript-eslint/parser', // Use the TypeScript parser
  parserOptions: {
    ecmaVersion: 2021, // Allows modern ECMAScript features
    sourceType: 'module', // Allows `import` and `export`
  },
  // other configurations
};


/*module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort', '@typescript-eslint', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
  ],
  rules: {
    'func-names': ['error', 'always'],
    // TS
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    // IMPORTS
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^react', '^@?\\w'],
          ['^(src|server|config|libs|public|locales)(/.*|$)'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-anonymous-default-export': 'error',

    // A11y
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/media-has-caption': 'off',

    // HOOKS
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react/display-name': 'off',
  },
};
*/