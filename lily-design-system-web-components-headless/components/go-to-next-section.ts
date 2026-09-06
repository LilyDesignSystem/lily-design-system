// GoToNextSection component
//
// A link that takes users to the next section of the current page.
// Renders an <a> linking to a section anchor on the same page; the href
// provides the destination and the link text provides the accessible name
// (native anchor semantics — no separate aria-label is needed).
//
// Attributes:
//   href — REQUIRED. Anchor URL of the next section, typically "#section-id".
//   label — REQUIRED. Visible link text.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/go-to-next-section/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class GoToNextSection extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.go-to-next-section")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "go-to-next-section");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.textContent = label;
        passThroughAttributes(this, a, HANDLED);

        this.appendChild(a);
    }
}
