import { defineConfig } from "vitest/config";

// The benchmarks (bin/benchmark, tasks.md P35-T4), apart from the tests: one file, no parallel files, node only.
export default defineConfig({
    test: {
        environment: "node",
        include: ["*.bench.ts"],
        fileParallelism: false,
    },
});
