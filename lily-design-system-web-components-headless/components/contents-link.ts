// ContentsLink component
//
// One table of contents link.
//
// Attributes:
//   href — REQUIRED. The URL or anchor the link points to.
//   current — presence-based boolean; sets aria-current="true" when this
//     link corresponds to the currently visible section.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/contents-link/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "current", "count", "count-label"]);

export class ContentsLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.contents-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "contents-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        if (this.hasAttribute("current")) a.setAttribute("aria-current", "true");
        passThroughAttributes(this, a, HANDLED);

        const count = this.getAttribute("count");
        if (count !== null && count !== "") {
            a.setAttribute("data-count", count);
            if (Number(count) === 0) a.setAttribute("data-complete", "");
        }

        moveChildrenInto(this, a);

        // A visible count inside the link, after the text, so the link's accessible name includes it.
        const countLabel = this.getAttribute("count-label");
        if (countLabel) {
            const span = document.createElement("span");
            span.className = "contents-link-count";
            span.textContent = countLabel;
            a.appendChild(span);
        }
        this.appendChild(a);
    }
}
