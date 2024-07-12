const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'react-app',
    // 'react-app/jest',
  ],
  plugins: ['ban'],
  rules: {
    'arrow-body-style': ['off'],
    'import/extensions': ['off'],
    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'max-len': 'off',
    'brace-style': 'off',
    'global-require': 0,
    // react
    'react/button-has-type': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    // typescript
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/type-annotation-spacing': ['error', {
      before: false,
      after: true,
      overrides: {
        arrow: {
          before: true,
          after: true,
        },
      },
    }],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: true,
      },
    }],
  },
};
