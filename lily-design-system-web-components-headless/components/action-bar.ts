// ActionBar component
//
// A contextual action bar that appears when items are selected, showing
// the selection count and bulk action buttons. A <div role="toolbar">; the
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element.
//
// Attributes:
//   label — REQUIRED. Accessible name for the toolbar, via aria-label.
//   selected-count — REQUIRED. Count of currently selected items, exposed
//     as data-selected-count for CSS and tests.
//   selected-count-label — REQUIRED. Pre-formatted, locale-aware count
//     text, rendered in a visible <span class="action-bar-count">.
//   clear-selection-label — optional. When present, renders a clear button
//     with this as its aria-label.
//
// The clear button fires a bubbling, composed "lily-clear-selection"
// CustomEvent when activated, rather than accepting a JS callback prop —
// matching this catalog's event-based idiom for every other dismiss/close
// affordance (Banner's "lily-close", ToggleButton's "lily-change").
//
// References:
//   - components/action-bar/index.md (canonical contract)
//   - Adobe Spectrum Action Bar: https://spectrum.adobe.com/page/action-bar/
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import { attachToolbar } from "../lib/widget-keys.js";
import { applySelfClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

export class ActionBar extends HTMLElement {
    #built = false;
    #count: HTMLSpanElement | null = null;
    #clear: HTMLButtonElement | null = null;

    // A change to label, selected-count, selected-count-label, clear-selection-label or class is shown (tasks.md P50-T28): the
    // clear button comes and goes with its label.
    static get observedAttributes(): string[] {
        return [
            "label",
            "selected-count",
            "selected-count-label",
            "clear-selection-label",
            "class",
        ];
    }

    attributeChangedCallback(): void {
        if (this.#built) this.#apply();
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        this.setAttribute("role", "toolbar");
        this.#count = document.createElement("span");
        this.#count.className = "action-bar-count";
        this.insertBefore(this.#count, this.firstChild);
        this.#apply();
        attachToolbar(this, { dismiss: ".action-bar-clear" });
    }

    #apply(): void {
        if (!this.classList.contains("action-bar")) applySelfClassName(this, "action-bar");
        setOrRemove(this, "aria-label", this.getAttribute("label"));
        this.setAttribute("data-selected-count", this.getAttribute("selected-count") ?? "0");
        if (this.#count) this.#count.textContent = this.getAttribute("selected-count-label") ?? "";

        const clearLabel = this.getAttribute("clear-selection-label");
        if (clearLabel === null) {
            this.#clear?.remove();
            this.#clear = null;
            return;
        }
        if (!this.#clear) {
            this.#clear = document.createElement("button");
            this.#clear.type = "button";
            this.#clear.className = "action-bar-clear";
            this.#clear.textContent = "×";
            this.#clear.addEventListener("click", this.#onClear);
            this.appendChild(this.#clear);
        }
        this.#clear.setAttribute("aria-label", clearLabel);
    }

    #onClear = (): void => {
        this.dispatchEvent(
            new CustomEvent("lily-clear-selection", { bubbles: true, composed: true }),
        );
    };
}
