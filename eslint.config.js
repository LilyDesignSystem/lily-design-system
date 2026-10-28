// Repo-level ESLint flat config. Errors fail; warnings are reported only.
// Scope is set by the "lint" script in package.json (the Svelte, React and Vue
// headless libraries); widen it there as other libraries are cleaned.
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
];
