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

import { applySelfClassName } from "../lib/dom-utils.js";

export class ActionBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "action-bar");
        this.setAttribute("role", "toolbar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("data-selected-count", this.getAttribute("selected-count") ?? "0");

        const count = document.createElement("span");
        count.className = "action-bar-count";
        count.textContent = this.getAttribute("selected-count-label") ?? "";
        this.insertBefore(count, this.firstChild);

        const clearLabel = this.getAttribute("clear-selection-label");
        if (clearLabel !== null) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "action-bar-clear";
            button.setAttribute("aria-label", clearLabel);
            button.textContent = "×";
            button.addEventListener("click", this.#onClear);
            this.appendChild(button);
        }
    }

    #onClear = (): void => {
        this.dispatchEvent(new CustomEvent("lily-clear-selection", { bubbles: true, composed: true }));
    };
}
