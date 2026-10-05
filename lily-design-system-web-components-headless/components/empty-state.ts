// EmptyState component
//
// A <div> for "nothing here yet" content. The custom element stands in for
// the div directly (applySelfClassName, pattern 2). The heading, text and
// action are consumer-supplied children; no icon is rendered. When `label`
// is given the root becomes a labelled group. It is deliberately NOT a live
// region (contrast InfoState's role="status").
//
// Attributes:
//   label — optional. Adds role="group" and aria-label.
//   ...rest — stay on the host (which is the root).
//
// References:
//   - components/empty-state/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class EmptyState extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label"];
    }

    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;
        applySelfClassName(this, "empty-state");
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label) {
            this.setAttribute("role", "group");
            this.setAttribute("aria-label", label);
        } else {
            this.removeAttribute("role");
            this.removeAttribute("aria-label");
        }
    }
}
