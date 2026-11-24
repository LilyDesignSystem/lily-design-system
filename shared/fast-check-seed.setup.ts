// A fixed fast-check seed when FAST_CHECK_SEED is set. bin/coverage-report sets it, so the property tests reach the same
// branches on every run and the coverage floor (coverage-floor.tsv) measures the code, not the luck of the inputs. An
// ordinary test run leaves it unset and keeps its random inputs.
import fc from "fast-check";

const seed = process.env.FAST_CHECK_SEED;
if (seed !== undefined) fc.configureGlobal({ seed: Number(seed) });
