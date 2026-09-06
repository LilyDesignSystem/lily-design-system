// Listbox component
//
// A list of selectable options using the ARIA listbox role, with full
// keyboard navigation. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). The consumer
// supplies option elements as light-DOM children (`role="option"
// tabindex="-1"`) and manages selection state (`aria-selected`)
// externally.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//
// Keyboard:
//   ArrowDown — move focus to the next option, wrapping from last to first.
//   ArrowUp — move focus to the previous option, wrapping from first to last.
//   Home — move focus to the first option.
//   End — move focus to the last option.
//
// References:
//   - components/listbox/index.md (canonical contract)
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Listbox extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "listbox");
            this.setAttribute("role", "listbox");
            this.addEventListener("keydown", this.#onKeydown);
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const options = Array.from(this.querySelectorAll<HTMLElement>("[role='option']"));
        if (options.length === 0) return;
        const current = document.activeElement as HTMLElement | null;
        const index = current ? options.indexOf(current) : -1;

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < options.length - 1 ? index + 1 : 0;
                options[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : options.length - 1;
                options[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                options[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                options[options.length - 1]?.focus();
                break;
            }
        }
    };
}
