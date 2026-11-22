/**
 * Type-ahead for grids: typing letters moves to the next row whose label starts with them. Pure, so it is unit-tested without a browser.
 * The WAI-ARIA APG listbox / tree model: the letters typed in quick succession form one prefix; the prefix resets after a pause; the same
 * letter pressed again cycles through the rows that start with it.
 */
import { foldText } from "./search-text";

export const TYPEAHEAD_RESET_MS = 700;

export type TypeaheadState = { prefix: string; at: number };

/** A printable initial outside IME composition or a Ctrl, Alt or Meta shortcut. */
export function isTypeaheadKey(event: {
    key: string;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    isComposing?: boolean;
    nativeEvent?: { isComposing?: boolean };
}): boolean {
    return (
        /^[^\p{Cc}\p{Cf}\p{Cs} ]$/u.test(event.key.normalize("NFC")) &&
        !event.isComposing &&
        !event.nativeEvent?.isComposing &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
    );
}

/** The prefix after `key` is pressed at time `now`: it grows while presses are within `resetMs` of each other, else starts over. */
export function nextTypeaheadState(
    previous: TypeaheadState,
    key: string,
    now: number,
    resetMs: number = TYPEAHEAD_RESET_MS,
): TypeaheadState {
    const continuing = now - previous.at <= resetMs;
    return { prefix: (continuing ? previous.prefix : "") + key, at: now };
}

/** Thrown for a `from` that is neither -1 (no row) nor the index of a row: invalid data is an error, never wrapped round. */
export class TypeaheadError extends RangeError {
    readonly reason: "from";
    constructor(reason: "from", message: string) {
        super(`findTypeaheadMatch: ${message}`);
        this.name = "TypeaheadError";
        this.reason = reason;
    }
}

/**
 * The index of the row to move to, or -1. Searches from the row after `from` (-1: from the top) and wraps; a `from` that is
 * not -1 or a row's index throws a TypeaheadError. A prefix of one repeated letter ("ss") is
 * treated as that single letter, so pressing it again steps through the rows starting with it.
 */
export function findTypeaheadMatch(
    labels: readonly string[],
    from: number,
    prefix: string,
): number {
    if (!Number.isInteger(from) || from < -1 || from >= labels.length) {
        throw new TypeaheadError(
            "from",
            `from ${String(from)} is not -1 or a row of ${labels.length}`,
        );
    }
    // Fold each initial separately: a Hangul syllable folds to several Jamo and a CJK ideograph can occupy two UTF-16 units.
    const initials = Array.from(prefix.normalize("NFC"), foldText).filter(Boolean);
    if (initials.length === 0) return -1;
    const cycle = initials.every((initial) => initial === initials[0]);
    const needle = cycle ? initials[0] : foldText(prefix);
    // A growing prefix ("de") may keep the current row; a single letter, or a repeated one, must move on.
    const startOffset = cycle ? 1 : 0;
    for (let step = 0; step < labels.length; step++) {
        const index = (from + startOffset + step + labels.length) % labels.length;
        if (foldText(labels[index]).startsWith(needle)) return index;
    }
    return -1;
}
