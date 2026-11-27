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
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["href", "label", "current", "count", "count-label"]);

export class ContentsLink extends HTMLElement {
    // A change to its attributes, or to class, is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLAnchorElement>(":scope > a.contents-link");
        if (!el) return;
        el.className = rootClassName(this, "contents-link");
        setOrRemove(el, "href", this.getAttribute("href"));
        setOrRemove(el, "aria-label", this.getAttribute("label"));
        if (this.hasAttribute("current")) el.setAttribute("aria-current", "true");
        else el.removeAttribute("aria-current");
        const count = this.getAttribute("count");
        setOrRemove(el, "data-count", count === "" ? null : count);
        el.toggleAttribute("data-complete", count !== null && count !== "" && Number(count) === 0);
        const countLabel = this.getAttribute("count-label");
        let span = el.querySelector<HTMLSpanElement>(":scope > .contents-link-count");
        if (!countLabel) span?.remove();
        else {
            if (!span) {
                span = document.createElement("span");
                span.className = "contents-link-count";
                el.appendChild(span);
            }
            span.textContent = countLabel;
        }
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > a.contents-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "contents-link");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
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
