module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['Google', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 'error',
    'new-cap': 'off',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'error',
    'no-unused-expressions': 'warn',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'no-invalid-this': 'off',
    '@typescript-eslint/no-invalid-this': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-shadow': 'warn',
    'no-magic-numbers': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'warn',
      {
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: false,
        enforceConst: true,
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-loss-of-precision': 'off',
    '@typescript-eslint/no-loss-of-precision': ['error'],
    'no-loop-func': 'off',
    '@typescript-eslint/no-loop-func': ['error'],
    'no-throw-literal': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    camelcase: 'warn',
    // prettier rules
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        parser: 'typescript',
        printWidth: 120,
        endOfLine: 'auto',
      },
      {
        usePrettierrc: false,
      },
    ],
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
      },
    },
  ],
};
