// Footnote component
//
// An <aside role="note"> for supplementary content (citations, source
// references, clarifications). The `id` attribute serves double duty:
// it becomes the element's id — for in-page linking from a superscript
// reference marker (`<a href="#fn1">`) — and its aria-label.
//
// Attributes:
//   id — REQUIRED. Element id + aria-label value.
//   ...rest — spread onto the <aside>.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): this component's own AGENTS.md Metadata line says "HTML tag:
// <span>", but its own Implementation Notes ("Renders as <aside> with
// role="note"") and every other framework's port (including the static
// html-headless one) render <aside role="note">. Followed here per this
// batch's instruction to cross-check html-headless when a component's
// own AGENTS.md is internally inconsistent.
//
// References:
//   - components/footnote/index.md (canonical contract)
//   - WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
//   - MDN aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["id"]);

export class Footnote extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > aside.footnote")) return;

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "footnote");
        aside.setAttribute("role", "note");
        const id = this.getAttribute("id");
        if (id !== null) {
            aside.id = id;
            aside.setAttribute("aria-label", id);
        }
        passThroughAttributes(this, aside, HANDLED);

        moveChildrenInto(this, aside);
        this.appendChild(aside);
    }
}
