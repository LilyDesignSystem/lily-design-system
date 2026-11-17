import { defineConfig } from "vitest/config";

// The shared modules' tests, run in place (tasks.md P35-T3). The packages run their copies too; this runner
// exists so StrykerJS can mutate the one source each copy comes from.
export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["*.test.ts"],
    },
});
