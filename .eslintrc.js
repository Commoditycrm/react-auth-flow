const { compilerOptions } = require('./tsconfig.base.json');
const { resolve } = require('path');

const paths = Object.keys(compilerOptions.paths).map((a) => {
  return [
    a.replace('/*', ''),
    resolve(compilerOptions.paths[a][0].replace('/*', '')),
  ];
});

console.log('Using paths at ', paths);

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.base.json',
  },
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'import',
    'promise',
    'prettier',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['test/**'],
      plugins: ['jest', '@typescript-eslint'],
      extends: ['plugin:jest/recommended'],
      rules: { 'jest/prefer-expect-assertions': 'off' },
    },
  ],
  rules: {
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-prototype-builtins': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'max-classes-per-file': 0,
    'no-console': 'warn',
    'prettier/prettier': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'consistent-return': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
      },
    ],
    'class-methods-use-this': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
      alias: {
        map: paths,
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
      webpack: {
        config: './webpack/webpack.build.js',
      },
    },
  },
};
