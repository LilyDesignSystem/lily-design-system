// Collapsible component
//
// A container that can be expanded or collapsed, built on native
// <details>/<summary> elements — no custom ARIA needed, since the browser
// handles all expanded/collapsed announcements.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <div>) and from html-headless's demo (a bare div with a hand-rolled
// aria-expanded script): svelte-headless and react-headless both confirm
// real <details>/<summary> rendering. Followed the 2-of-3 majority and
// headless.md's "most specific semantic element" rule — this is also the
// component's whole documented reason to exist ("Uses native <details> and
// <summary> elements for built-in accessibility support").
//
// Attributes:
//   summary — REQUIRED. The clickable summary text shown as the toggle
//     trigger.
//   open — presence-based boolean; bindable both ways
//     (`el.toggleAttribute("open")` and native user interaction stay in
//     sync).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ open: boolean }>
// whenever the state changes by user interaction.
//
// Keyboard: Enter/Space toggle the disclosure (native <summary> behaviour).
//
// References:
//   - components/collapsible/index.md (canonical contract)
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["summary", "open"]);

export class Collapsible extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "summary"];
    }

    #details: HTMLDetailsElement | null = null;
    #summaryEl: HTMLElement | null = null;

    connectedCallback(): void {
        if (!this.#details) {
            const details = document.createElement("details");
            details.className = rootClassName(this, "collapsible");
            passThroughAttributes(this, details, HANDLED);
            details.addEventListener("toggle", this.#onToggle);

            const summaryEl = document.createElement("summary");
            details.appendChild(summaryEl);

            moveChildrenInto(this, details);
            this.appendChild(details);
            this.#details = details;
            this.#summaryEl = summaryEl;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const details = this.#details;
        const summaryEl = this.#summaryEl;
        if (!details || !summaryEl) return;
        summaryEl.textContent = this.getAttribute("summary") ?? "";
        details.open = this.hasAttribute("open");
    }

    #onToggle = (): void => {
        const open = this.#details?.open ?? false;
        this.toggleAttribute("open", open);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { open }, bubbles: true, composed: true }),
        );
    };
}
