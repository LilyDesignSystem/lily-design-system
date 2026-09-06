// Menu component
//
// A list of actions or options triggered by a button, using the WAI-ARIA
// menu pattern with vertical keyboard navigation between `[role="menuitem"]`
// descendants. The custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element — matching every
// framework's own port, which renders the same bare <div role="menu">.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//
// Keyboard:
//   ArrowDown — focus the next menu item, wrapping to the first.
//   ArrowUp — focus the previous menu item, wrapping to the last.
//   Home — focus the first menu item.
//   End — focus the last menu item.
//
// References:
//   - components/menu/index.md (canonical contract)
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Menu extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "menu");
        this.setAttribute("role", "menu");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.addEventListener("keydown", this.#onKeydown);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const items = Array.from(this.querySelectorAll<HTMLElement>("[role='menuitem']"));
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
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
