import "@testing-library/svelte/vitest";
import fc from "fast-check";

// A fixed fast-check seed when FAST_CHECK_SEED is set (bin/coverage-report sets it), so a coverage run reaches the same
// branches every time; an ordinary run keeps its random inputs.
if (process.env.FAST_CHECK_SEED !== undefined)
    fc.configureGlobal({ seed: Number(process.env.FAST_CHECK_SEED) });
