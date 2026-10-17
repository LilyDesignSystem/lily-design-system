/**
 * Type-ahead for grids: typing letters moves to the next row whose label starts with them. Pure, so it is unit-tested without a browser.
 * The WAI-ARIA APG listbox / tree model: the letters typed in quick succession form one prefix; the prefix resets after a pause; the same
 * letter pressed again cycles through the rows that start with it.
 */
import { foldText } from "./search-text";

export const TYPEAHEAD_RESET_MS = 700;

export type TypeaheadState = { prefix: string; at: number };

/** Whether a key press is a type-ahead character: one printable character, no Ctrl, Alt or Meta. */
export function isTypeaheadKey(event: { key: string; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean }): boolean {
    return event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.altKey && !event.metaKey;
}

/** The prefix after `key` is pressed at time `now`: it grows while presses are within `resetMs` of each other, else starts over. */
export function nextTypeaheadState(previous: TypeaheadState, key: string, now: number, resetMs: number = TYPEAHEAD_RESET_MS): TypeaheadState {
    const continuing = previous.prefix !== "" && now - previous.at <= resetMs;
    return { prefix: (continuing ? previous.prefix : "") + key, at: now };
}

/**
 * The index of the row to move to, or -1. Searches from the row after `from` and wraps. A prefix of one repeated letter ("ss") is
 * treated as that single letter, so pressing it again steps through the rows starting with it.
 */
export function findTypeaheadMatch(labels: readonly string[], from: number, prefix: string): number {
    const folded = foldText(prefix);
    if (folded === "" || labels.length === 0) return -1;
    const repeated = folded.length > 1 && [...folded].every((c) => c === folded[0]);
    const needle = repeated ? folded[0] : folded;
    // A growing prefix ("de") may keep the current row; a single letter, or a repeated one, must move on.
    const startOffset = needle.length > 1 ? 0 : 1;
    for (let step = 0; step < labels.length; step++) {
        const index = (from + startOffset + step + labels.length) % labels.length;
        if (foldText(labels[index]).startsWith(needle)) return index;
    }
    return -1;
}
