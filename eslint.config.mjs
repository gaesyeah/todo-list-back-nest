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
      //! Query from @nestjs/common is banned — use QueryParams() for URL
      //! query params, Query() from src/http-query for HTTP QUERY (RFC 10008).
      //? "paths" bans importing Query from @nestjs/common directly;
      //? "patterns" blocks bypassing the barrel file via internal imports.
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
  //! Exception: this file IS the intentional bridge to Nest's Query.
  {
    files: ['src/http-query/decorators/query-params.decorator.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
);
