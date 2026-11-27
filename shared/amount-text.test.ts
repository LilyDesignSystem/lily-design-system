import { describe, expect, test } from "vitest";

import { currencyDecimals, readAmount } from "./amount-text";

describe("readAmount (tasks.md P54-T2)", () => {
    test("a decimal comma is a decimal in a locale that writes one", () => {
        expect(readAmount("12,50", "fr-FR", "EUR")).toEqual({ kind: "amount", value: 12.5 });
        expect(readAmount("12,50", "de-DE", "EUR")).toEqual({ kind: "amount", value: 12.5 });
    });

    test("grouping separators are read, typed spaces included", () => {
        expect(readAmount("1 234,5", "fr-FR", "EUR")).toEqual({ kind: "amount", value: 1234.5 });
        expect(readAmount("1.234,5", "de-DE", "EUR")).toEqual({ kind: "amount", value: 1234.5 });
        expect(readAmount("1,234.50", "en-GB", "GBP")).toEqual({ kind: "amount", value: 1234.5 });
    });

    test("blank is empty, never zero; zero is an amount", () => {
        expect(readAmount("  ", "en-GB", "GBP")).toEqual({ kind: "empty" });
        expect(readAmount("0", "en-GB", "GBP")).toEqual({ kind: "amount", value: 0 });
    });

    test("text that is not a number in the locale is refused, never guessed", () => {
        expect(readAmount("12.50", "fr-FR", "EUR")).toEqual({
            kind: "invalid",
            reason: "not-a-number",
        });
        expect(readAmount("twelve", "en-GB", "GBP")).toEqual({
            kind: "invalid",
            reason: "not-a-number",
        });
        expect(readAmount("1e3", "en-GB", "GBP")).toEqual({
            kind: "invalid",
            reason: "not-a-number",
        });
    });

    test("more decimals than the currency has are refused", () => {
        expect(currencyDecimals("ja-JP", "JPY")).toBe(0);
        expect(readAmount("1200", "ja-JP", "JPY")).toEqual({ kind: "amount", value: 1200 });
        expect(readAmount("12.5", "ja-JP", "JPY")).toEqual({ kind: "invalid", reason: "decimals" });
        expect(readAmount("1.005", "en-GB", "GBP")).toEqual({
            kind: "invalid",
            reason: "decimals",
        });
    });

    test("a minus sign, typed or typographic", () => {
        expect(readAmount("-5,25", "fr-FR", "EUR")).toEqual({ kind: "amount", value: -5.25 });
        expect(readAmount(String.fromCharCode(0x2212) + "5.25", "en-GB", "GBP")).toEqual({
            kind: "amount",
            value: -5.25,
        });
    });
});
