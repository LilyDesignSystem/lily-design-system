import { configDefaults, defineConfig } from "vitest/config";

// No framework plugin needed — these are native custom elements, not a
// JSX/SFC dialect a bundler needs to transform. jsdom supplies
// `customElements`, `HTMLElement`, and the DOM the tests exercise.
export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest-setup.ts"],
        // A recipe is its own package, with its own JSX transform and install.
        exclude: [...configDefaults.exclude, "recipes/**"],
    },
});
