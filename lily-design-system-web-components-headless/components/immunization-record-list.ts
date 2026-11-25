// <lily-immunization-record-list>: a list of a patient's immunizations, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// Renders a light-DOM <ul class="immunization-record-list">. For any status but "known", status-label is the list's one item.
// Attributes: status (known | none-known | not-recorded | unavailable | omitted | not-applicable -> data-status), status-label, label, conflict-label
// (the words for a list that says none are known and holds an entry: shown instead of status-label, never both; HC-C17).
// A change to any of them, or to class, is shown; the entries are the app's and stay.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, setOrRemove } from "../lib/live-element.js";
import { hasEntries, recordListState, watchEntries } from "../lib/record-list-state.js";

const HANDLED = new Set(["status", "status-label", "label", "conflict-label"]);

export class ImmunizationRecordList extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    // Whether the list held an entry when it was last shown. The observer lives as long as the list, so a list moved in the page
    // is still watched; it is collected with the list.
    private entries = false;
    private watched: Element | undefined;

    protected update(): void {
        const existing = this.querySelector<HTMLUListElement>(
            ":scope > ul.immunization-record-list",
        );
        const ul = existing ?? document.createElement("ul");
        ul.className = rootClassName(this, "immunization-record-list");
        if (!existing) {
            passThroughAttributes(this, ul, HANDLED);
            moveChildrenInto(this, ul);
        }
        this.entries = hasEntries(ul, "immunization-record-list");
        const shown = recordListState(
            {
                status: this.text("status"),
                statusLabel: this.text("status-label"),
                conflictLabel: this.getAttribute("conflict-label") ?? undefined,
                label: this.getAttribute("label") ?? undefined,
            },
            this.entries,
        );
        setOrRemove(ul, "data-status", shown.status);
        setOrRemove(ul, "aria-label", shown.name);
        const own = (name: string, text: string | null): void => {
            const before = ul.querySelector(`:scope > li.immunization-record-list-${name}`);
            if (text === null) {
                before?.remove();
                return;
            }
            const li = before ?? document.createElement("li");
            li.className = `immunization-record-list-${name}`;
            li.textContent = text;
            if (!before) ul.prepend(li);
        };
        own("status", shown.showItem ? (shown.words ?? "") : null);
        if (!existing) this.appendChild(ul);
        if (this.watched !== ul) {
            this.watched = ul;
            watchEntries(ul, "immunization-record-list", (entries) => {
                if (entries !== this.entries) this.update();
            });
        }
    }
}
