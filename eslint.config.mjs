// Repo-level ESLint flat config. Errors fail; warnings are reported only.
// Scope is set by the "lint" script in package.json (every lily-design-system-* subproject plus shared/).
import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import vue from "eslint-plugin-vue";
import reactHooks from "eslint-plugin-react-hooks";
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
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    { files: ["**/*.svelte"], languageOptions: { parserOptions: { parser: ts.parser } } },
    { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: ts.parser } } },
    {
        files: ["**/*.tsx"],
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
