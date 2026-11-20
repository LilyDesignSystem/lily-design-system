// Repo-level ESLint flat config. Errors fail; warnings are reported only.
// Scope is set by the "lint" script in package.json (every lily-design-system-* subproject plus shared/).
import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import vue from "eslint-plugin-vue";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import angular from "angular-eslint";
import globals from "globals";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/.svelte-kit/**",
            "**/build/**",
            "**/*.stories.*",
            "**/.next/**",
            "**/.nuxt/**",
            "**/.output/**",
            "**/.analog/**",
            "**/.angular/**",
            "**/_site/**",
            "**/obj/**",
            "**/coverage/**",
            "**/playwright-report/**",
            "**/test-results/**",
            "**/*.d.ts",
            // StrykerJS's sandbox and report (bin/mutation-test).
            "shared/.stryker-tmp/**",
            "shared/reports/**",
            // Prettier-ignored and not parseable by Svelte (duplicate attribute, deliberate).
            "lily-design-system-svelte-locale-picker/examples/ssr-cookie.svelte",
            "**/*.min.js",
        ],
    },
    { linterOptions: { reportUnusedDisableDirectives: "off" } },
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    ...vue.configs["flat/essential"],
    ...angular.configs.tsRecommended.map((config) => ({
        ...config,
        files: ["lily-design-system-angular-*/**/*.ts"],
    })),
    {
        files: ["lily-design-system-angular-*/**/*.ts"],
        ignores: ["**/*.{test,spec}.ts"],
        processor: angular.processInlineTemplates,
    },
    ...[...angular.configs.templateRecommended, ...angular.configs.templateAccessibility].map(
        (config) => ({
            ...config,
            files: ["lily-design-system-angular-*/**/*.html"],
        }),
    ),
    {
        ...jsxA11y.flatConfigs.recommended,
        files: [
            "lily-design-system-react-*/**/*.{jsx,tsx}",
            "lily-design-system-solid-*/**/*.{jsx,tsx}",
        ],
        ignores: ["**/*.{test,spec}.{jsx,tsx}"],
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
            // Headless widgets use roving tabindex, conditional ARIA relationships and
            // consumer-supplied media tracks. The plugins cannot see those runtime
            // contracts, so report the affected heuristics while keeping structural
            // ARIA/name rules fatal.
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/interactive-supports-focus": "warn",
            "jsx-a11y/label-has-associated-control": "warn",
            "jsx-a11y/media-has-caption": "warn",
            "jsx-a11y/no-noninteractive-element-interactions": "warn",
            "jsx-a11y/no-noninteractive-tabindex": "warn",
            "jsx-a11y/no-redundant-roles": "warn",
            "jsx-a11y/no-static-element-interactions": "warn",
            "jsx-a11y/role-has-required-aria-props": "warn",
        },
    },
    {
        files: ["lily-design-system-angular-*/**/*.ts"],
        rules: {
            // Output names are intentionally cross-framework public API names. Inline
            // templates are processed by the Angular template configuration above.
            "@angular-eslint/no-output-native": "warn",
        },
    },
    {
        files: ["lily-design-system-angular-*/**/*.html"],
        rules: {
            // Templates use roving focus and conditionally mounted ARIA targets, which
            // these static rules cannot follow; keep the heuristics visible as warnings.
            "@angular-eslint/template/click-events-have-key-events": "warn",
            "@angular-eslint/template/interactive-supports-focus": "warn",
            "@angular-eslint/template/label-has-associated-control": "warn",
            "@angular-eslint/template/role-has-required-aria": "warn",
        },
    },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    { files: ["**/*.svelte"], languageOptions: { parserOptions: { parser: ts.parser } } },
    { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: ts.parser } } },
    {
        files: ["**/*.tsx"],
        // Solid's JSX is not React: no hooks, and a component body runs once, so dynamic() at setup is correct.
        ignores: ["lily-design-system-solid-*/**"],
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // React Compiler-era rules: they flag established patterns (state seeded in an
            // effect, ref reads in render). Reported, not fatal, until each is reworked.
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/refs": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/use-memo": "warn",
            "react-hooks/purity": "warn",
        },
    },
    {
        // Test globals (describe/it/expect/vi/beforeEach...) for any runner the libraries use.
        files: ["**/*.{test,spec}.{js,mjs,cjs,ts,tsx}", "**/__tests__/**/*.{js,ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.vitest,
                vi: "readonly",
                vitest: "readonly",
                // WebdriverIO (the HTML headless tests)
                browser: "readonly",
                driver: "readonly",
                $: "readonly",
                $$: "readonly",
            },
        },
    },
    {
        // CommonJS libraries (HTML and Nunjucks headless): require() is how they import.
        files: ["**/*.js", "**/*.cjs"],
        rules: { "@typescript-eslint/no-require-imports": "off" },
    },
    {
        // Nuxt auto-imports (useHead, useRoute, computed, ...).
        files: [
            "lily-design-system-vue-nuxt-examples/**/*.{vue,ts}",
            "**/examples/nuxt-cookie/**/*.{vue,ts}",
        ],
        languageOptions: {
            globals: Object.fromEntries(
                [
                    "useHead",
                    "useRoute",
                    "useRouter",
                    "useNuxtApp",
                    "useState",
                    "useFetch",
                    "createError",
                    "computed",
                    "ref",
                    "reactive",
                    "watch",
                    "onMounted",
                    "definePageMeta",
                    "navigateTo",
                ].map((n) => [n, "readonly"]),
            ),
        },
    },
    {
        // Reported, not fatal, until each is reworked (see tasks.md P12-T3).
        rules: {
            "svelte/prefer-svelte-reactivity": "warn",
            "svelte/no-at-html-tags": "warn",
            "svelte/no-useless-mustaches": "warn",
            "svelte/no-dom-manipulating": "warn",
            "vue/no-dupe-keys": "warn",
            "no-regex-spaces": "warn",
            // New in the ESLint 10 recommended set (2026-11-02): 38 sites in ported and generated code.
            "no-useless-assignment": "warn",
        },
    },
    {
        rules: {
            // Rest-props components take `[key: string]: unknown` and cast at the edges.
            "@typescript-eslint/no-explicit-any": "off",
            // Unused vars are reported, not fatal; `_` marks intentional ones.
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            // Export code strips control characters from cells on purpose.
            "no-control-regex": "off",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-irregular-whitespace": "warn",
            "prefer-const": "warn",
            "no-unused-private-class-members": "warn",
            // `cond ? a() : b()` as a statement is how the Alpine plugin picks showModal / setAttribute.
            "@typescript-eslint/no-unused-expressions": [
                "error",
                { allowTernary: true, allowShortCircuit: true },
            ],
            // Component names are fixed by the catalog (Button, Card, ...).
            "vue/multi-word-component-names": "off",
            // Fixed-length lists (five stars, 0-10 scores) are keyed by position.
            "svelte/require-each-key": "warn",
            // svelte-check, not this rule, is the authority on whether an ignore is needed.
            "svelte/no-unused-svelte-ignore": "off",
            // Headless links navigate with plain hrefs; routing is the consumer's.
            "svelte/no-navigation-without-resolve": "off",
        },
    },
    {
        files: ["**/*.svelte"],
        rules: {
            // Svelte 5 runes and `$props` destructuring read as import assignments to this rule.
            "no-import-assign": "off",
            // Reported until each statement-expression is rewritten.
            "@typescript-eslint/no-unused-expressions": "warn",
        },
    },
    {
        // Prettier owns line breaks; it can place a `[i]` access on the next line.
        rules: { "no-unexpected-multiline": "off" },
    },
];
