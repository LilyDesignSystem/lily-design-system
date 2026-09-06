// TabPanel component
//
// A <div role="tabpanel" tabindex="0"> associated with a tab in a tab bar.
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED unless labelled-by is present. Accessible name, via
//     aria-label.
//   labelled-by — id of the controlling tab; when present, used as
//     aria-labelledby and aria-label is omitted.
//   selected — presence-based boolean; bindable. The `hidden` attribute
//     reflects !selected.
//
// References:
//   - components/tab-panel/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class TabPanel extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["selected", "label", "labelled-by"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "tab-panel");
            this.setAttribute("role", "tabpanel");
            this.tabIndex = 0;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;

        const labelledBy = this.getAttribute("labelled-by");
        if (labelledBy !== null) {
            this.setAttribute("aria-labelledby", labelledBy);
            this.removeAttribute("aria-label");
        } else {
            this.removeAttribute("aria-labelledby");
            const label = this.getAttribute("label");
            if (label !== null) this.setAttribute("aria-label", label);
        }

        this.hidden = !this.hasAttribute("selected");
    }
}
