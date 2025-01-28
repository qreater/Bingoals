/*************************
 *
 * Copyright 2025 @Qreater
 * Licensed under the Apache License, Version 2.0.
 * See: http://www.apache.org/licenses/LICENSE-2.0
 *
 *************************/

import headerPlugin from 'eslint-plugin-header'

import tsParser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'

headerPlugin.rules.header.meta.schema = false

export default tseslint.config(
    {
        ignores: [
            '**/dev/**',
            '**/dist/**',
            '**/node_modules/**',
            'tsconfig.json',
        ],
    },
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
            },
        },
        plugins: {
            header: headerPlugin,
        },
        rules: {
            'header/header': [
                'error',
                'block',
                [
                    '************************',
                    ' * ',
                    ' * Copyright 2025 @Qreater',
                    ' * Licensed under the Apache License, Version 2.0.',
                    ' * See: http://www.apache.org/licenses/LICENSE-2.0',
                    ' * ',
                    ' ************************',
                ],
                2,
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
)
