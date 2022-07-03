module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': 'off',

    'import/order': ['error', {
      alphabetize: {
        caseInsensitive: false,
        order: 'asc',
      },
      'newlines-between': 'always',
    }],

    'import/prefer-default-export': 'off',
    'max-len': ['error', 200],
    'no-param-reassign': 'off',
    'no-promise-executor-return': 'off',
    'object-curly-newline': 'off',

    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
    }],

    'sort-keys': 'error',
  },
};
