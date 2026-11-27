// The test vectors in shared/vectors/ (tasks.md P43-T3) replayed against the TypeScript modules they come from. The Swift and
// Kotlin ports read the same files, so a vector edited here without the module agreeing fails this test, and a port that
// disagrees fails its own. Every file in shared/vectors/ must name a function this runner knows.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
    ageParts,
    durationParts,
    hasWords,
    htmlDuration,
    meterScale,
    partialDatePrecision,
    toIsoDuration,
} from "./clinical-format";
import { splitGraphemes, truncateMiddle, type TruncateMiddleOptions } from "./middle-truncation";
import {
    canAddItem,
    canRemoveItem,
    datePartsShown,
    dateSequence,
    isCalendarDate,
    joinDateParts,
    quantityProblem,
    splitDateValue,
    stepStatus,
} from "./form-parts";
import { logicalKey } from "./direction";
import {
    ipsContents,
    ipsMissingRequired,
    ipsSectionCode,
    ipsSectionId,
    ipsSectionIsRequired,
} from "./ips-sections";
import { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState } from "./typeahead";
import {
    nextWheelIndex,
    nextWheelPrefix,
    wheelIndexNearest,
    wheelMoveKey,
    wheelTypeaheadIndex,
} from "./wheel-picker";

// `throws` is the reason every platform's error must carry (the module's RangeError subclass, or its equivalent), or `true`
// for a module whose error has no reason yet.
type Case = { fn: string; args: unknown[]; expected?: unknown; throws?: string | true };
type VectorFile = { module: string; description: string; cases: Case[] };

const clusters = (text: string) => splitGraphemes(text).length;

/* eslint-disable @typescript-eslint/no-explicit-any */
const FUNCTIONS: Record<string, (...args: any[]) => unknown> = {
    foldText,
    searchTerms,
    matchesSearch,
    highlightSegments,
    splitGraphemes,
    // truncateMiddle measured in grapheme clusters, so every platform measures the same way.
    truncateMiddleByClusters: (text: string, options: Omit<TruncateMiddleOptions, "measure">) =>
        truncateMiddle(text, { ...options, measure: clusters }),
    meterScale: (value, low, high, units) => meterScale(value, low, high, units ?? undefined),
    ageParts,
    toIsoDuration,
    partialDatePrecision,
    durationParts,
    hasWords,
    htmlDuration,
    isTypeaheadKey,
    nextTypeaheadState,
    findTypeaheadMatch,
    logicalKey,
    ipsSectionCode,
    ipsSectionIsRequired,
    ipsSectionId,
    ipsMissingRequired,
    ipsContents,
    wheelMoveKey,
    wheelIndexNearest,
    nextWheelIndex,
    nextWheelPrefix,
    wheelTypeaheadIndex,
    datePartsShown,
    dateSequence,
    splitDateValue,
    joinDateParts,
    isCalendarDate,
    quantityProblem,
    canAddItem,
    canRemoveItem,
    stepStatus,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const dir = join(dirname(fileURLToPath(import.meta.url)), "vectors");
const files = readdirSync(dir).filter((name) => name.endsWith(".json"));

describe("shared/vectors", () => {
    it("has vector files", () => {
        expect(files.length).toBeGreaterThan(0);
    });

    for (const name of files) {
        const file = JSON.parse(readFileSync(join(dir, name), "utf8")) as VectorFile;
        describe(name, () => {
            it("names its module after its file", () => {
                expect(`${file.module}.json`).toBe(name);
            });
            file.cases.forEach((c, index) => {
                it(`${index}: ${c.fn}(${JSON.stringify(c.args)})`, () => {
                    const fn = FUNCTIONS[c.fn];
                    expect(fn, `unknown function ${c.fn}`).toBeTypeOf("function");
                    if (c.throws !== undefined) {
                        let thrown: unknown;
                        try {
                            fn(...c.args);
                        } catch (error) {
                            thrown = error;
                        }
                        expect(thrown, "should throw").toBeInstanceOf(RangeError);
                        if (c.throws !== true)
                            expect((thrown as { reason?: string }).reason).toBe(c.throws);
                    } else {
                        const result = fn(...c.args);
                        expect(result === undefined ? null : result).toEqual(c.expected);
                    }
                });
            });
        });
    }
});
