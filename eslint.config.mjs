import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const hasTypeScriptLint = existsSync(require.resolve.paths('@eslint/js')[0] + '/@eslint/js');

const config = hasTypeScriptLint
  ? await (async () => {
      const [
        { default: js },
        { default: reactHooks },
        { default: reactRefresh },
        { default: tseslint }
      ] = await Promise.all([
        import('@eslint/js'),
        import('eslint-plugin-react-hooks'),
        import('eslint-plugin-react-refresh'),
        import('typescript-eslint')
      ]);

      return tseslint.config(
        { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
        js.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        {
          files: ['**/*.{ts,tsx}'],
          languageOptions: {
            parserOptions: {
              project: ['./tsconfig.app.json', './tsconfig.node.json'],
              tsconfigRootDir: import.meta.dirname
            }
          },
          plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh
          },
          rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
          }
        }
      );
    })()
  : [
      {
        ignores: [
          'dist/**',
          'coverage/**',
          'node_modules/**',
          'src/**/*.ts',
          'src/**/*.tsx',
          'vite.config.ts',
          'tailwind.config.ts'
        ]
      },
      {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module'
        },
        rules: {
          'no-unused-vars': 'warn',
          'no-undef': 'off'
        }
      }
    ];

export default config;
