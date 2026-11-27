// Footnote component
//
// A <span role="note"> for supplementary content (citations, source
// references, clarifications), not an <aside>, so each footnote is not its
// own landmark. The `id` moves from the host to the span, the target of an
// in-page reference (`<a href="#fn1">`); it is not used as a name.
//
// Attributes:
//   id — REQUIRED. The element id.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/footnote/index.md (canonical contract)
//   - WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["id"]);

export class Footnote extends HTMLElement {
    // A change to class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLSpanElement>(":scope > span.footnote");
        if (!el) return;
        el.className = rootClassName(this, "footnote");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > span.footnote")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "footnote");
        span.setAttribute("role", "note");
        const id = this.getAttribute("id");
        if (id !== null) {
            this.removeAttribute("id");
            span.id = id;
        }
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
