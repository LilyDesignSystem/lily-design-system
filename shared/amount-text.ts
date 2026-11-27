/**
 * Reading a money amount as a person typed it, in their locale (tasks.md P54-T2). `currency-input` reads its text with
 * `Number`, so a decimal comma ("12,50") or a grouping separator reads as no value, the same as an empty field. This reads
 * the text with the locale's own separators, as `Intl.NumberFormat` writes them, and says why when it cannot: the caller
 * keeps the text on screen beside its own error words. Nothing is guessed: text that is not a number in that locale is
 * refused, never read some other way.
 *
 *   readAmount("12,50", "fr-FR", "EUR")   { kind: "amount", value: 12.5 }
 *   readAmount("1 234,5", "fr-FR", "EUR") { kind: "amount", value: 1234.5 }
 *   readAmount("12.50", "en-GB", "GBP")   { kind: "amount", value: 12.5 }
 *   readAmount("12,5", "ja-JP", "JPY")    { kind: "invalid", reason: "decimals" }   (JPY has no minor unit)
 *   readAmount("  ", "en-GB", "GBP")      { kind: "empty" }
 */
export type AmountText =
    | { kind: "empty" }
    | { kind: "amount"; value: number }
    | { kind: "invalid"; reason: "not-a-number" | "decimals" };

function separators(locale: string): { group: string; decimal: string } {
    // 12345.6 always has a decimal, and a group wherever the locale groups five digits.
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const of = (type: string) =>
        parts
            .filter((p) => p.type === type)
            .map((p) => p.value)
            .join("");
    return { group: of("group"), decimal: of("decimal") };
}

/** The most decimals the currency has (2 for EUR, 0 for JPY, 3 for KWD). */
export function currencyDecimals(locale: string, currencyCode: string): number {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
    }).resolvedOptions().maximumFractionDigits as number;
}

// Spaces a person may type for a grouping separator: ordinary, no-break and narrow no-break.
const SPACES = /[\s\u00a0\u202f]/g;
const MINUS = /^\u2212/;

/** Reads `text` as an amount in `currencyCode`, written the way `locale` writes numbers. */
export function readAmount(text: string, locale: string, currencyCode: string): AmountText {
    const trimmed = text.trim();
    if (trimmed === "") return { kind: "empty" };
    const { group, decimal } = separators(locale);
    let plain = group.trim() === "" ? trimmed.replace(SPACES, "") : trimmed.split(group).join("");
    if (decimal !== ".") {
        if (plain.includes(".")) return { kind: "invalid", reason: "not-a-number" };
        plain = plain.split(decimal).join(".");
    }
    plain = plain.replace(MINUS, "-");
    if (!/^-?\d+(\.\d+)?$/.test(plain)) return { kind: "invalid", reason: "not-a-number" };
    const decimals = plain.includes(".") ? plain.split(".")[1].length : 0;
    if (decimals > currencyDecimals(locale, currencyCode))
        return { kind: "invalid", reason: "decimals" };
    return { kind: "amount", value: Number(plain) };
}
