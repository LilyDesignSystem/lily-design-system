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
import { initialListboxState, listboxKeydown } from "../lib/listbox-machine.js";

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

    // Every keyboard decision lives in the framework-free machine (shared/listbox-machine.ts, copied to lib/ by
    // bin/sync-shared-modules); this element only reads the DOM and moves focus as the transition says. Roving focus
    // only: this element has no active-descendant mode.
    #onKeydown = (event: KeyboardEvent): void => {
        const options = Array.from(this.querySelectorAll<HTMLElement>("[role='option']"));
        const t = listboxKeydown(initialListboxState(), event, {
            labels: options.map((option) => (option.textContent ?? "").trim()),
            focusedIndex: options.indexOf(document.activeElement as HTMLElement),
        });
        if (t.preventDefault) event.preventDefault();
        if (t.focus !== undefined) options[t.focus]?.focus();
    };
}
