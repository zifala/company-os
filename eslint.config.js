import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public', 'registry', 'src/components/ui', 'packages/*/vendor']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-restricted-properties': ['error', { object: 'Math', property: 'random' }],
      'no-restricted-imports': ['error', { patterns: [{ group: ['@inertiajs/*'], message: 'Inertia lives only in registry/adapters. Import from @/lib/navigation.' }] }],
    },
  },
  {
    // The firewall: what the library, blocks, templates and demos may never do.
    files: ['src/components/company-os/**', 'src/blocks/**', 'src/templates/**', 'src/docs/demos/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@inertiajs/*'], message: 'Inertia lives only in registry/adapters. Import from @/lib/navigation.' },
            { group: ['react-router', 'react-router-dom'], message: 'The router is behind the seam. Import Link, navigate, useCurrentUrl from @/lib/navigation.' },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "JSXOpeningElement[name.name='select']", message: 'No native select. Use OptionSelect or RemoteCombobox.' },
        { selector: 'JSXIdentifier[name=/Breadcrumb/]', message: 'Nothing above a page title: no breadcrumbs. The sidebar and the section nav say where you are.' },
        { selector: 'JSXElement[openingElement.name.name=/^(TableRow|TableCell|[A-Z][A-Za-z]*Cell)$/] JSXIdentifier[name=/^Avatar/]', message: 'No avatars in tables. Name over detail in one cell.' },
        { selector: "ConditionalExpression:has(JSXIdentifier[name='EmptyState']):has(JSXIdentifier[name=/^(DataTable|Table)$/])", message: 'Empty keeps the table. Pass the empty state to DataTable instead of swapping the table for a card.' },
      ],
    },
  },
])
