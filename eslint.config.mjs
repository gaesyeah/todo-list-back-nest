// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      //! @nestjs/common's Query is banned on purpose — it's ambiguous with our
      //! custom Query decorator (HTTP QUERY method, see src/http-query).
      //* Use QueryParams() for URL query params (?foo=bar), and Query()
      //* from src/http-query for the HTTP QUERY method (RFC 10008).
      //? Second block below blocks bypassing the barrel file (src/http-query/index.ts)
      //? by importing internal decorator/guard files directly.
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@nestjs/common',
              importNames: ['Query'],
              message:
                "Don't import Query directly from @nestjs/common. Import Query/QueryParams from 'src/http-query' instead.",
            },
          ],
          patterns: [
            {
              group: [
                '**/http-query/decorators/*',
                '**/http-query/guards/*',
                '**/http-query/http-query.module',
              ],
              message:
                "Import from 'src/http-query' (barrel file), not internal files directly.",
            },
          ],
        },
      ],
    },
  },
  //! Exception: this file IS the intentional bridge to Nest's original Query,
  //! so the restriction above doesn't apply here.
  {
    files: ['src/http-query/decorators/query-params.decorator.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
);
