// StrykerJS over the shared pure modules (tasks.md P35-T3). Run with bin/mutation-test; see spec/testing.
// Each module with its own test file is mutated; a surviving mutant is a change to the logic that no test notices.
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
    testRunner: "vitest",
    // pnpm keeps plugins out of Stryker's own node_modules, so name them.
    plugins: ["@stryker-mutator/vitest-runner"],
    vitest: { configFile: "vitest.config.ts" },
    coverageAnalysis: "perTest",
    // Five modules have no test file here and are left out, so the score measures this suite honestly: pattern-tester is
    // the test driver itself; aria-baseline, cell-types, command-keys and menu-keys are tested only through the packages'
    // copies (a gap; see spec/testing, Mutation testing).
    mutate: [
        "*.ts",
        "!*.test.ts",
        "!vitest.config.ts",
        "!vitest.bench.config.ts",
        "!*.bench.ts",
        "!*.d.ts",
        "!pattern-tester.ts",
        "!aria-baseline.ts",
        "!cell-types.ts",
        "!command-keys.ts",
        "!menu-keys.ts",
    ],
    // The tests read the label and zone-name packs and the pattern contracts, so only the C# stays out of the sandbox.
    ignorePatterns: ["reports", "*.cs"],
    reporters: ["clear-text", "progress", "json"],
    jsonReporter: { fileName: "reports/mutation/mutation.json" },
    concurrency: 6,
    timeoutMS: 10000,
    thresholds: { high: 90, low: 75, break: null },
    tempDirName: ".stryker-tmp",
    cleanTempDir: "always",
};
