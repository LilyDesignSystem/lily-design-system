// DropdownMenu component
//
// A menu that opens below a trigger button: a <div> wrapper containing a
// <button> trigger and a <div role="menu"> panel. The custom element
// stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. Bindable on `open`.
//
// Attributes:
//   label — REQUIRED. Accessible name for the menu button; also displayed
//     as the button's visible text (per the canonical contract).
//   open — presence-based boolean; bindable.
//   ...rest — spread onto the outer wrapper.
//
// Keyboard:
//   Enter/Space on the button — toggles the menu open/closed (native
//     <button> behaviour)
//   ArrowDown — move focus to the next menu item (wraps to first)
//   ArrowUp — move focus to the previous menu item (wraps to last)
//   Home — move focus to the first menu item
//   End — move focus to the last menu item
//   Escape — close the menu and return focus to the trigger button, firing
//     a bubbling, composed "lily-close" CustomEvent (matching Dialog's
//     contract in this catalog)
//
// Accessibility: focus is automatically moved to the first [role=menuitem]
// when the menu transitions to open.
//
// References:
//   - components/dropdown-menu/index.md (canonical contract)
//   - WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
//   - WAI-ARIA menu role: https://www.w3.org/TR/wai-aria-1.2/#menu
//   - WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class DropdownMenu extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "open"];
    }

    #built = false;
    #wasOpen = false;
    #button: HTMLButtonElement | null = null;
    #menu: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "dropdown-menu");

            const button = document.createElement("button");
            button.type = "button";
            button.addEventListener("click", this.#onToggle);

            const menu = document.createElement("div");
            menu.setAttribute("role", "menu");
            menu.addEventListener("keydown", this.#onKeydown);

            moveChildrenInto(this, menu);
            this.appendChild(button);
            this.appendChild(menu);
            this.#button = button;
            this.#menu = menu;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const button = this.#button;
        const menu = this.#menu;
        if (!button || !menu) return;

        const label = this.getAttribute("label") ?? "";
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-label", label);
        button.textContent = label;
        menu.setAttribute("aria-label", label);

        const open = this.hasAttribute("open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
        menu.hidden = !open;

        if (open && !this.#wasOpen) {
            menu.querySelector<HTMLElement>("[role='menuitem']")?.focus();
        }
        this.#wasOpen = open;
    }

    #items(): HTMLElement[] {
        return Array.from(this.#menu?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? []);
    }

    #onToggle = (): void => {
        this.toggleAttribute("open");
    };

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
                this.#button?.focus();
                this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
                break;
            }
        }
    };
}
