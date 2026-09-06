// SkipLink component
//
// A hidden link for keyboard users to skip to main content. Should be the
// first focusable element on the page. The label text is rendered as the
// link's text content (which natively serves as the accessible name) —
// there is no children slot.
//
// Attributes:
//   href — the anchor target the link navigates to (default "#content").
//   label — the visible link text (default "Skip to content").
//   ...rest — spread onto the <a>.
//
// References:
//   - components/skip-link/index.md (canonical contract)
//   - WCAG 2.1 Bypass Blocks: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
//   - WAI-ARIA Authoring Practices - Skip Navigation: https://www.w3.org/WAI/ARIA/apg/practices/skip-nav/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label"]);

export class SkipLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.skip-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "skip-link");
        a.href = this.getAttribute("href") ?? "#content";
        a.textContent = this.getAttribute("label") ?? "Skip to content";
        passThroughAttributes(this, a, HANDLED);

        this.appendChild(a);
    }
}
