/**
 * What a record list says about itself, and whether that can be true (HC-C17, tasks.md P50-T2, spec/healthcare-ui).
 *
 * "None known" beside an entry is a contradiction, and either half of it may be the wrong one. So the entries stay, the words
 * "none known" go, and the app's own words for the conflict (`conflictLabel`) take their place, as the list's item and its name.
 *
 * A list cannot know its entries until they are in the page: in most frameworks an empty loop and a full one look the same to it.
 * So the entries are read from the page and watched. HTML from a server shows the status as given until the script runs.
 */
import { hasWords } from "./clinical-format";

export type RecordListStatus =
    "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";

export interface RecordListState {
    /** For `data-status`: the status given, or "conflict". */
    status: string | undefined;
    /** For `aria-label`; undefined when nothing true can be said. */
    name: string | undefined;
    /** Whether the list shows its status as an item. */
    showItem: boolean;
    /** The item's words. */
    words: string | undefined;
    conflict: boolean;
}

// An entry someone has withdrawn does not contradict "none known": it says itself that it is refuted, or entered in error.
const WITHDRAWN =
    '[data-entry-state="entered-in-error"],[data-verification-status="entered-in-error"],' +
    '[data-verification-status="refuted"],[data-status="entered-in-error"]';

/** The list's own items, which are not entries, and nodes that show nothing. */
function isEntry(child: Element, base: string): boolean {
    if (child.tagName === "TEMPLATE" || child.tagName === "SCRIPT") return false;
    if (child.classList.contains(`${base}-status`) || child.classList.contains(`${base}-coverage`))
        return false;
    return !child.matches(WITHDRAWN);
}

/** Whether a record list in the page holds an entry that is not withdrawn. `base` is its class, such as "allergy-record-list". */
export function hasEntries(list: Element, base: string): boolean {
    return Array.from(list.children).some((child) => isEntry(child, base));
}

/** Calls `changed` with whether the list holds an entry, now and each time that may have changed. Returns a function that stops. */
export function watchEntries(
    list: Element,
    base: string,
    changed: (entries: boolean) => void,
): () => void {
    const read = () => changed(hasEntries(list, base));
    read();
    if (typeof MutationObserver === "undefined") return () => {};
    const observer = new MutationObserver(read);
    observer.observe(list, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-entry-state", "data-verification-status", "data-status"],
    });
    return () => observer.disconnect();
}

/** What the list shows, given whether it holds an entry. Pure. */
export function recordListState(
    given: {
        status: string | undefined;
        statusLabel: string | undefined;
        conflictLabel?: string;
        label?: string;
    },
    entries: boolean,
): RecordListState {
    const { status, statusLabel, conflictLabel, label } = given;
    const conflict = status === "none-known" && entries;
    const words = conflict ? (hasWords(conflictLabel) ? conflictLabel : undefined) : statusLabel;
    return {
        status: conflict ? "conflict" : status,
        // A label that only repeats the status is the status, so it goes with it.
        name: label === undefined || (conflict && label === statusLabel) ? words : label,
        showItem: status !== "known" && !(conflict && words === undefined),
        words,
        conflict,
    };
}
