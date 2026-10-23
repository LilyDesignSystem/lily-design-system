// Generated from shared/wheel-picker.ts by bin/sync-shared-modules; edit the shared module, never this copy.
/**
 * Keyboard model for a wheel picker: a single-select listbox where the selection follows the cursor (APG listbox, "selection
 * follows focus"), so moving the cursor IS choosing. Pure and framework-neutral, tested without a browser.
 *
 * Disabled options are skipped by every move. Arrows wrap only when `loop` is set; Home, End, PageUp and PageDown never wrap.
 */

export const WHEEL_MOVE_KEYS                    = ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"];

/** Indexes of the options that can be selected. */
function enabledIndexes(options                        )           {
    const out           = [];
    options.forEach((o, i) => {
        if (!o.disabled) out.push(i);
    });
    return out;
}

/**
 * The index to select after `key`, or -1 when no option can be selected. `current` is the selected index, or -1 for none.
 * With nothing selected, ArrowDown / PageDown / Home choose the first enabled option and ArrowUp / PageUp / End the last.
 */
export function nextWheelIndex(options                        , current        , key              , move                   = {})         {
    const enabled = enabledIndexes(options);
    if (enabled.length === 0) return -1;
    const first = enabled[0];
    const last = enabled[enabled.length - 1];
    const position = enabled.indexOf(current);
    const pageSize = Math.max(1, Math.floor(move.pageSize ?? 5));

    if (key === "Home") return first;
    if (key === "End") return last;
    if (position === -1) return key === "ArrowDown" || key === "PageDown" ? first : last;

    switch (key) {
        case "ArrowDown":
            return position + 1 < enabled.length ? enabled[position + 1] : move.loop ? first : current;
        case "ArrowUp":
            return position > 0 ? enabled[position - 1] : move.loop ? last : current;
        case "PageDown":
            return enabled[Math.min(enabled.length - 1, position + pageSize)];
        case "PageUp":
            return enabled[Math.max(0, position - pageSize)];
    }
}

/** Lower-case and strip diacritics so "é" is typed with "e". */
function fold(text        )         {
    return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
}

export const WHEEL_TYPEAHEAD_RESET_MS = 700;

/** The prefix after `key` at time `now`: it grows while presses are within the reset time, else starts over. */
export function nextWheelPrefix(previous                , key        , now        , resetMs         = WHEEL_TYPEAHEAD_RESET_MS)                 {
    const continuing = previous.prefix !== "" && now - previous.at <= resetMs;
    return { prefix: (continuing ? previous.prefix : "") + key, at: now };
}

/** Whether a key press is a type-ahead character: one printable character other than space, no Ctrl, Alt or Meta. */
export function isWheelTypeaheadKey(event                                                                         )          {
    return event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.altKey && !event.metaKey;
}

/**
 * The enabled option to move to for the typed `prefix`, or -1. Searches from the option after `current` and wraps; a prefix of one
 * repeated letter ("ss") counts as that single letter, so pressing it again steps through the options that start with it.
 */
export function wheelTypeaheadIndex(options                        , current        , prefix        )         {
    const folded = fold(prefix);
    if (folded === "" || options.length === 0) return -1;
    const repeated = folded.length > 1 && [...folded].every((c) => c === folded[0]);
    const needle = repeated ? folded[0] : folded;
    const startOffset = needle.length > 1 ? 0 : 1;
    const from = current < 0 ? -startOffset : current;
    for (let step = 0; step < options.length; step++) {
        const index = (from + startOffset + step + options.length) % options.length;
        const option = options[index];
        if (!option.disabled && fold(option.label).startsWith(needle)) return index;
    }
    return -1;
}
