// ContextMenu component
//
// A menu that appears on right-click or long-press: a <div role="menu">,
// shown/hidden via its own `open` attribute (bindable —
// `el.toggleAttribute("open")` works both ways, matching Dialog's `open`
// idiom in this catalog). The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). The consumer triggers
// opening externally (e.g. via a contextmenu event handler) and supplies
// role="menuitem" children (ContextMenuItem).
//
// Attributes:
//   label — REQUIRED. Accessible name for the menu, via aria-label.
//   open — presence-based boolean; bindable. Absent by default (starts
//     hidden).
//   ...rest — spread onto the container.
//
// Keyboard:
//   ArrowDown — move focus to the next menu item (wraps to first)
//   ArrowUp — move focus to the previous menu item (wraps to last)
//   Home — move focus to the first menu item
//   End — move focus to the last menu item
//   Escape — close the menu (removes `open`) and fire a bubbling, composed
//     "lily-close" CustomEvent, matching Dialog/TourList's contract in
//     this catalog.
//
// Accessibility: focus is automatically moved to the first [role=menuitem]
// when the menu transitions to open.
//
// References:
//   - components/context-menu/index.md (canonical contract)
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

import { applySelfClassName } from "../lib/dom-utils.js";

export class ContextMenu extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "open"];
    }

    #built = false;
    #wasOpen = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "context-menu");
            this.setAttribute("role", "menu");
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
        const open = this.hasAttribute("open");
        this.hidden = !open;
        if (open && !this.#wasOpen) {
            this.querySelector<HTMLElement>("[role='menuitem']")?.focus();
        }
        this.#wasOpen = open;
    }

    #items(): HTMLElement[] {
        return Array.from(this.querySelectorAll<HTMLElement>("[role='menuitem']"));
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const items = this.#items();
        const current = document.activeElement as HTMLElement | null;
        const index = current ? items.indexOf(current) : -1;

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                items[index < items.length - 1 ? index + 1 : 0]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                items[index > 0 ? index - 1 : items.length - 1]?.focus();
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
            case "Escape": {
                event.preventDefault();
                this.removeAttribute("open");
                this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
                break;
            }
        }
    };
}
