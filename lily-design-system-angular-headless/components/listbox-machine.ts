/**
 * The listbox behaviour core: one framework-free transition function that every library's Listbox binds with a thin
 * adapter (spec/competitive-position item 3). Pure, so the whole WAI-ARIA APG listbox keyboard contract is unit-tested
 * without a browser.
 *
 * The adapter owns the DOM: it reads the options' labels and which option has focus, calls `listboxKeydown`, then
 * applies the returned transition (prevent the default, move focus, set the active index, call the consumer's
 * callbacks). The machine owns every decision.
 *
 * Two navigation models, as the Listbox components document them:
 *
 *   "roving-focus" (default): real focus moves between the options. ArrowDown/ArrowUp wrap; Home/End jump. No
 *   typeahead, paging or activation.
 *
 *   "active-descendant": the root keeps focus and a virtual cursor (`activeIndex`) moves. ArrowDown/ArrowUp wrap, or
 *   clamp when `clamp` is set; Home/End jump; PageUp/PageDown move by `pageSize`, wrapping or clamping like the
 *   arrows; printable characters run typeahead when `typeahead` is set; Enter/Space activate the active option;
 *   Escape and Tab are reported so the consumer decides what they do (Tab is never prevented).
 *
 * Selection is the consumer's: the machine reports activation and the consumer sets `aria-selected`. Disabled options
 * are not skipped, matching the components this machine was extracted from.
 */
import {
    findTypeaheadMatch,
    isTypeaheadKey,
    nextTypeaheadState,
    type TypeaheadState,
} from "./typeahead";

export type ListboxNavigation = "roving-focus" | "active-descendant";

/** Typeahead prefix lifetime: a pause this long starts a new prefix. The Listbox components have always used 500 ms. */
export const LISTBOX_TYPEAHEAD_RESET_MS = 500;

/** The component props the machine reads. Every field is optional and defaults as the components do. */
export interface ListboxConfig {
    navigation?: ListboxNavigation;
    /** Arrows and paging clamp at the ends instead of wrapping (active-descendant only). */
    clamp?: boolean;
    /** Printable characters move the cursor (active-descendant only). */
    typeahead?: boolean;
    /** PageUp/PageDown step (active-descendant only). Default 10. */
    pageSize?: number;
    /** Typeahead reset pause in milliseconds. Default `LISTBOX_TYPEAHEAD_RESET_MS`. */
    typeaheadResetMs?: number;
}

/** The machine's state: the virtual cursor (-1 = none) and the typeahead prefix. */
export interface ListboxState {
    activeIndex: number;
    typeahead: TypeaheadState;
}

/** The parts of a keyboard event the machine reads. A DOM, React or Svelte KeyboardEvent fits. */
export interface ListboxKey {
    key: string;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
}

/** What the adapter reads from the DOM at the moment of the key press. */
export interface ListboxContext {
    /** Each option's text, trimmed, in document order. Its length is the option count. */
    labels: readonly string[];
    /** The option that has real focus, or -1 (roving-focus only). */
    focusedIndex?: number;
    /** The time of the key press in milliseconds (for typeahead). */
    now?: number;
}

/** What the adapter must do. Absent fields mean "nothing". */
export interface ListboxTransition {
    state: ListboxState;
    /** Call `event.preventDefault()`. */
    preventDefault: boolean;
    /** Set the active index to this value (and notify the consumer), even when it is unchanged. */
    setActiveIndex?: number;
    /** Move real focus to the option at this index (roving-focus). */
    focus?: number;
    /** Call the consumer's onActivate with this index. */
    activate?: number;
    /** Call the consumer's onEscape. */
    escape?: boolean;
    /** Call the consumer's onTabOut, before the browser handles Tab. */
    tabOut?: boolean;
}

/** A fresh state with the cursor at `activeIndex`. */
export function initialListboxState(activeIndex: number = -1): ListboxState {
    return { activeIndex, typeahead: { prefix: "", at: 0 } };
}

/** `index` moved by `delta` among `count` options, clamped to the ends or wrapped. `count` must be positive. */
export function stepListboxIndex(
    index: number,
    delta: number,
    count: number,
    clamp: boolean,
): number {
    const next = index + delta;
    return clamp ? Math.min(Math.max(next, 0), count - 1) : ((next % count) + count) % count;
}

function rovingKeydown(
    state: ListboxState,
    key: string,
    count: number,
    focused: number,
): ListboxTransition {
    let focus: number;
    switch (key) {
        case "ArrowDown":
            focus = focused < count - 1 ? focused + 1 : 0;
            break;
        case "ArrowUp":
            focus = focused > 0 ? focused - 1 : count - 1;
            break;
        case "Home":
            focus = 0;
            break;
        case "End":
            focus = count - 1;
            break;
        default:
            return { state, preventDefault: false };
    }
    return count > 0 ? { state, preventDefault: true, focus } : { state, preventDefault: true };
}

function activeDescendantKeydown(
    state: ListboxState,
    event: ListboxKey,
    context: ListboxContext,
    config: ListboxConfig,
): ListboxTransition {
    const { labels } = context;
    const count = labels.length;
    const clamp = config.clamp ?? false;
    const move = (delta: number): ListboxTransition => {
        if (count === 0) return { state, preventDefault: true };
        const activeIndex = stepListboxIndex(state.activeIndex, delta, count, clamp);
        return {
            state: { ...state, activeIndex },
            preventDefault: true,
            setActiveIndex: activeIndex,
        };
    };
    const jump = (activeIndex: number): ListboxTransition => ({
        state: { ...state, activeIndex },
        preventDefault: true,
        setActiveIndex: activeIndex,
    });
    const pageSize = config.pageSize ?? 10;
    switch (event.key) {
        case "ArrowDown":
            return move(1);
        case "ArrowUp":
            return move(-1);
        case "Home":
            return jump(count ? 0 : -1);
        case "End":
            return jump(count - 1);
        case "PageDown":
            return move(pageSize);
        case "PageUp":
            return move(-pageSize);
        case "Enter":
        case " ":
            return state.activeIndex >= 0
                ? { state, preventDefault: true, activate: state.activeIndex }
                : { state, preventDefault: true };
        case "Escape":
            return { state, preventDefault: true, escape: true };
        case "Tab":
            return { state, preventDefault: false, tabOut: true };
    }
    if (!config.typeahead || !isTypeaheadKey(event) || count === 0)
        return { state, preventDefault: false };
    const typeahead = nextTypeaheadState(
        state.typeahead,
        event.key,
        context.now ?? 0,
        config.typeaheadResetMs ?? LISTBOX_TYPEAHEAD_RESET_MS,
    );
    const match = findTypeaheadMatch(
        labels,
        state.activeIndex < 0 ? 0 : state.activeIndex,
        typeahead.prefix,
    );
    if (match < 0) return { state: { ...state, typeahead }, preventDefault: false };
    return {
        state: { activeIndex: match, typeahead },
        preventDefault: false,
        setActiveIndex: match,
    };
}

/** The transition for one key press. Never mutates `state`. */
export function listboxKeydown(
    state: ListboxState,
    event: ListboxKey,
    context: ListboxContext,
    config: ListboxConfig = {},
): ListboxTransition {
    if ((config.navigation ?? "roving-focus") === "active-descendant") {
        return activeDescendantKeydown(state, event, context, config);
    }
    return rovingKeydown(state, event.key, context.labels.length, context.focusedIndex ?? -1);
}
