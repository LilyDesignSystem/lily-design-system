// Details component
//
// A disclosure widget built on the native <details>/<summary> elements for
// built-in browser accessibility. Two-way bindable on `open`: setting or
// removing the host's `open` attribute drives the inner <details>, and a
// native user-driven toggle (clicking <summary>) reflects back onto the
// host's `open` attribute in turn.
//
// Attributes:
//   summary — REQUIRED. Text displayed in the clickable summary toggle.
//   open — presence-based boolean; bindable. Absent by default (collapsed).
//   ...rest — spread onto the <details>.
//
// Keyboard: Enter or Space toggles when <summary> is focused — native
// browser behaviour, no custom keydown handling needed.
//
// References:
//   - components/details/index.md (canonical contract)
//   - MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
//   - MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["summary", "open"]);

export class Details extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open"];
    }

    #details: HTMLDetailsElement | null = null;

    connectedCallback(): void {
        if (this.#details) return;

        const details = document.createElement("details");
        details.className = rootClassName(this, "details");

        const summary = document.createElement("summary");
        summary.textContent = this.getAttribute("summary") ?? "";
        details.appendChild(summary);

        passThroughAttributes(this, details, HANDLED);
        moveChildrenInto(this, details);

        details.open = this.hasAttribute("open");
        details.addEventListener("toggle", () => {
            this.toggleAttribute("open", details.open);
        });

        this.appendChild(details);
        this.#details = details;
    }

    attributeChangedCallback(name: string): void {
        if (name === "open" && this.#details) this.#details.open = this.hasAttribute("open");
    }
}
