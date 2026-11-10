// Generated from shared/wheel-picker.ts by bin/sync-shared-modules; edit the shared module, never this copy.
/**
 * Keyboard model for a wheel picker: a single-select listbox where the selection follows the cursor (APG listbox, "selection
 * follows focus"), so moving the cursor IS choosing. Pure and framework-neutral, tested without a browser.
 *
 * Disabled options are skipped by every move. Arrows wrap only when `loop` is set; Home, End, PageUp and PageDown never wrap.
 */

export const WHEEL_MOVE_KEYS                    = [
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
    "PageUp",
    "PageDown",
];

/** The axis the options run along. Vertical (the default) moves with ArrowUp / ArrowDown, horizontal with ArrowLeft / ArrowRight. */

/**
 * The move a physical key makes on a wheel of this orientation, or undefined when the key does not move it. Horizontal wheels move
 * with ArrowLeft / ArrowRight, swapped when `rtl`, so the arrow always points the way the cursor goes; their ArrowUp / ArrowDown are
 * left to the page. Home, End, PageUp and PageDown move a wheel of either orientation.
 */
export function wheelMoveKey(
    key        ,
    orientation                   = "vertical",
    rtl          = false,
)                           {
    if (key === "Home" || key === "End" || key === "PageUp" || key === "PageDown") return key;
    if (orientation === "horizontal") {
        if (key === "ArrowRight") return rtl ? "ArrowUp" : "ArrowDown";
        if (key === "ArrowLeft") return rtl ? "ArrowDown" : "ArrowUp";
        return undefined;
    }
    return key === "ArrowDown" || key === "ArrowUp" ? key : undefined;
}

/**
 * The enabled option nearest the middle of the list, for a wheel that has stopped scrolling, or -1 when none is enabled.
 * `middles` holds each option's middle along the scrolling axis and `centre` the list's, in the same coordinates (for
 * example from getBoundingClientRect). A tie goes to the earlier option.
 */
export function wheelIndexNearest(
    options                        ,
    middles                   ,
    centre        ,
)         {
    let best = -1;
    let bestDistance = Infinity;
    options.forEach((option, index) => {
        if (option.disabled || middles[index] === undefined) return;
        const distance = Math.abs(middles[index] - centre);
        if (distance < bestDistance) {
            best = index;
            bestDistance = distance;
        }
    });
    return best;
}

/** How long a wheel waits after its last `scroll` event before it counts as settled, where `scrollend` is missing. */
export const WHEEL_SCROLL_SETTLE_MS = 150;

/**
 * Scrolling chooses (spec/detent-lessons, P26-T1). When the user turns `list` (a wheel, a touch, the scroll bar) and it settles
 * (`scrollend`, or WHEEL_SCROLL_SETTLE_MS after the last `scroll` where that event is missing), choose the enabled option
 * nearest the middle, or re-centre the chosen one if the wheel came to rest elsewhere, such as on a disabled option. A scroll
 * with no gesture before it, such as the component's own centring, chooses nothing, so a list whose ends cannot reach the middle
 * never overrides a key or a click. Returns a function that removes the listeners.
 */
export function watchWheelScroll(list             , watch                  )             {
    let turned = false;
    let timer                                           ;
    const gesture = ()       => {
        turned = true;
    };
    const clicked = ()       => {
        turned = false;
    };
    const settle = ()       => {
        clearTimeout(timer);
        if (!turned || watch.disabled()) return;
        turned = false;
        const horizontal = watch.orientation() === "horizontal";
        const box = list.getBoundingClientRect();
        const centre = horizontal ? box.left + box.width / 2 : box.top + box.height / 2;
        const middles = Array.from(list.querySelectorAll             ('[role="option"]'), (el) => {
            const row = el.getBoundingClientRect();
            return horizontal ? row.left + row.width / 2 : row.top + row.height / 2;
        });
        const index = wheelIndexNearest(watch.options(), middles, centre);
        if (index < 0) return;
        if (index !== watch.selected()) watch.choose(index);
        else if (Math.abs(middles[index] - centre) > 1) watch.recentre();
    };
    const scrolled = ()       => {
        clearTimeout(timer);
        timer = setTimeout(settle, WHEEL_SCROLL_SETTLE_MS);
    };
    const events                         = [
        ["wheel", gesture],
        ["touchstart", gesture],
        ["pointerdown", gesture],
        ["click", clicked],
        ["scroll", scrolled],
        ["scrollend", settle],
    ];
    for (const [type, handler] of events) list.addEventListener(type, handler, { passive: true });
    return () => {
        clearTimeout(timer);
        for (const [type, handler] of events) list.removeEventListener(type, handler);
    };
}

/** Whether an element is in right-to-left text: the nearest `dir` attribute says "rtl". */
export function isWheelRtl(element         )          {
    return element.closest("[dir]")?.getAttribute("dir")?.toLowerCase() === "rtl";
}

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
export function nextWheelIndex(
    options                        ,
    current        ,
    key              ,
    move                   = {},
)         {
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
            return position + 1 < enabled.length
                ? enabled[position + 1]
                : move.loop
                  ? first
                  : current;
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
export function nextWheelPrefix(
    previous                ,
    key        ,
    now        ,
    resetMs         = WHEEL_TYPEAHEAD_RESET_MS,
)                 {
    const continuing = previous.prefix !== "" && now - previous.at <= resetMs;
    return { prefix: (continuing ? previous.prefix : "") + key, at: now };
}

/** Whether a key press is a type-ahead character: one printable character other than space, no Ctrl, Alt or Meta. */
export function isWheelTypeaheadKey(event

 )          {
    return (
        event.key.length === 1 &&
        event.key !== " " &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
    );
}

/**
 * The enabled option to move to for the typed `prefix`, or -1. Searches from the option after `current` and wraps; a prefix of one
 * repeated letter ("ss") counts as that single letter, so pressing it again steps through the options that start with it.
 */
export function wheelTypeaheadIndex(
    options                        ,
    current        ,
    prefix        ,
)         {
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
