/**
 * Middle truncation: shorten a string to fit a width by cutting out the middle, keeping the start and the end ("report-fi…q3.pdf").
 * Pure and framework-neutral: the caller supplies `measure`, so the module reads no DOM and is tested without a browser.
 *
 * Works on grapheme clusters (Intl.Segmenter, falling back to code points), so it never splits a surrogate pair, a combining
 * sequence or an emoji. The width search is binary, so it measures O(log n) candidate strings.
 *
 * Strategies:
 *   "even"      the start and the end share what fits, the end taking the extra cluster when the count is odd.
 *   "fixed-end" exactly `end` clusters are kept at the end; the start takes all the remaining room.
 *   "min-end"   an even split, but at least `end` clusters are kept at the end (a file extension, a domain suffix).
 */

export type TruncationStrategy = "even" | "fixed-end" | "min-end";

export interface TruncateMiddleOptions {
    /** The ellipsis string. Required: the module has no default text (internationalisation). */
    ellipsis: string;
    /** The width available to the whole result, in the unit `measure` returns. */
    maxWidth: number;
    /** Width of a string in the same unit as `maxWidth`. */
    measure: (text: string) => number;
    strategy?: TruncationStrategy;
    /** Clusters kept at the end for "fixed-end" and "min-end". Ignored by "even". */
    end?: number;
}

/** Split into user-perceived characters. */
export function splitGraphemes(text: string): string[] {
    const Segmenter = (Intl as { Segmenter?: new (locale?: string, options?: { granularity: "grapheme" }) => { segment(text: string): Iterable<{ segment: string }> } }).Segmenter;
    if (Segmenter) return Array.from(new Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
    return Array.from(text);
}

function clampEnd(end: number | undefined, length: number): number {
    if (end === undefined || !Number.isFinite(end)) return 0;
    return Math.min(Math.max(Math.floor(end), 0), length);
}

/** The text shortened to fit `maxWidth`, or unchanged when it already fits. */
export function truncateMiddle(text: string, options: TruncateMiddleOptions): string {
    const { ellipsis, maxWidth, measure, strategy = "even" } = options;
    if (measure(text) <= maxWidth) return text;

    const g = splitGraphemes(text);
    const n = g.length;
    const tail = (count: number): string => (count > 0 ? g.slice(n - count).join("") : "");
    const head = (count: number): string => g.slice(0, count).join("");

    if (strategy === "fixed-end") {
        const end = clampEnd(options.end, n);
        const endText = tail(end);
        const room = maxWidth - measure(ellipsis + endText);
        let low = 0;
        let high = n - end;
        while (low < high) {
            const middle = Math.ceil((low + high) / 2);
            if (measure(head(middle)) <= room) low = middle;
            else high = middle - 1;
        }
        return head(low) + ellipsis + endText;
    }

    const minEnd = strategy === "min-end" ? clampEnd(options.end, n) : 0;
    const split = (kept: number): [number, number] => {
        const endCount = Math.min(n, Math.max(Math.ceil(kept / 2), minEnd));
        return [Math.max(0, kept - endCount), endCount];
    };
    const room = maxWidth - measure(ellipsis);
    let low = 0;
    let high = n;
    while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        const [startCount, endCount] = split(middle);
        if (measure(head(startCount) + tail(endCount)) <= room) low = middle;
        else high = middle - 1;
    }
    const [startCount, endCount] = split(low);
    return head(startCount) + ellipsis + tail(endCount);
}
