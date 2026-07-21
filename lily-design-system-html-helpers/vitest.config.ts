import { defineConfig } from "vitest/config";

// Standalone test harness for the HTML (web component) helpers catalog.
// Each helper subproject (e.g. lily-design-system-html-theme-chooser)
// keeps its own `*.test.ts` next to its custom-element class; vitest
// discovers them all. jsdom provides customElements + DOM.
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-html-*/**/*.test.ts"],
  },
});
