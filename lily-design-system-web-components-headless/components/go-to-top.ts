// GoToTop component
//
// A link that returns users to the top of a long page. The href is
// configurable so consumers can target any element with an id; the visible
// text plus the destination provide the accessible name. Consumers may
// override the accessible name with a plain aria-label attribute (passed
// through as a rest attribute) when the visible text is decorative.
//
// Attributes:
//   href — anchor target on the current page (default "#top").
//   label — REQUIRED. Visible link text.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/go-to-top/index.md (canonical contract)
//   - MDN anchor element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class GoToTop extends HTMLElement {
    // A change to href, label (the link's text) or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const a = this.querySelector<HTMLAnchorElement>(":scope > a.go-to-top");
        if (!a) return;
        a.className = rootClassName(this, "go-to-top");
        a.href = this.getAttribute("href") ?? "#top";
        a.textContent = this.getAttribute("label") ?? "";
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > a.go-to-top")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "go-to-top");
        a.href = this.getAttribute("href") ?? "#top";
        const label = this.getAttribute("label");
        if (label !== null) a.textContent = label;
        passThroughAttributes(this, a, HANDLED);

        this.appendChild(a);
    }
}
