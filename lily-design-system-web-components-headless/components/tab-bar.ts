// TabBar component
//
// A <div role="tablist"> container with built-in arrow-key navigation
// between `[role="tab"]` descendants (rendered by TabBarButton). No native
// element behaviour is worth deferring to for a plain `<div>`, so the
// custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the tab list, via aria-label.
//
// Keyboard:
//   ArrowRight — focus the next tab, wrapping to the first.
//   ArrowLeft — focus the previous tab, wrapping to the last.
//   Home — focus the first tab.
//   End — focus the last tab.
//
// References:
//   - components/tab-bar/index.md (canonical contract)
//   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

import { applySelfClassName } from "../lib/dom-utils.js";

export class TabBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tab-bar");
        this.setAttribute("role", "tablist");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.addEventListener("keydown", this.#onKeydown);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const items = Array.from(this.querySelectorAll<HTMLElement>("[role='tab']"));
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    };
}
