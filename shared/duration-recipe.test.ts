// The duration-view guide's recipe (components/duration-view/index.md, Advice), run as written (tasks.md P55-T6a).
// Intl.DurationFormat takes whole numbers only, so a fractional second is split into milliseconds; it takes no sign, so the
// direction comes back apart, for the app's own words.
import { describe, expect, test } from "vitest";

import { durationParts } from "./clinical-format";

function durationWords(iso: string, locale: string) {
    const { negative, seconds, ...rest } = durationParts(iso);
    const whole = Math.trunc(seconds);
    const milliseconds = Math.round((seconds - whole) * 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DurationFormat is not in every TypeScript lib yet
    const words = new (Intl as any).DurationFormat(locale, { style: "long" }).format({
        ...rest,
        seconds: whole,
        milliseconds,
    });
    return { negative, words: words as string };
}

const hasDurationFormat =
    typeof (Intl as unknown as { DurationFormat?: unknown }).DurationFormat === "function";

describe.runIf(hasDurationFormat)("the duration-view recipe", () => {
    test("a fractional second is written, not thrown", () => {
        expect(durationWords("PT1.5S", "en-GB")).toEqual({
            negative: false,
            words: "1 second, 500 milliseconds",
        });
    });

    test("a decimal comma reads the same", () => {
        expect(durationWords("PT1,5S", "en-GB")).toEqual(durationWords("PT1.5S", "en-GB"));
    });

    test("a negative duration keeps its length, and its direction comes back apart", () => {
        expect(durationWords("-PT90M", "en-GB")).toEqual({ negative: true, words: "90 minutes" });
    });

    test("the units the record has are kept: 90 minutes is not 1.5 hours", () => {
        expect(durationWords("PT90M", "en-GB").words).toBe("90 minutes");
    });
});
