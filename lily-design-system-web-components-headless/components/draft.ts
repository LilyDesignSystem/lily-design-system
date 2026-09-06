// Draft component
//
// An early preliminary version of content (an article, email, report,
// …): a plain <div>. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible label for the draft, via aria-label.
//   status — optional. Editorial state (e.g. "in-progress", "review",
//     "ready-to-publish"), exposed as data-status.
//
// References:
//   - components/draft/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Draft extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "draft");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        const status = this.getAttribute("status");
        if (status !== null) this.setAttribute("data-status", status);
    }
}
