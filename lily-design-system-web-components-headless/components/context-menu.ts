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

import { applySelfClassName, nextId } from "../lib/dom-utils.js";
import { syncPopover, toggleOpened } from "./popover.js";

/** Keep one non-interactive first part, .context-menu-subject, holding `subject-label`, and name the menu by it. */
function syncSubject(
    menu: HTMLElement,
    text: string | null,
    id: string,
    label: string | null,
): void {
    let subject = menu.querySelector<HTMLElement>(":scope > .context-menu-subject");
    if (!text) {
        subject?.remove();
        menu.removeAttribute("aria-labelledby");
        if (label !== null) menu.setAttribute("aria-label", label);
        return;
    }
    if (!subject) {
        subject = document.createElement("div");
        subject.className = "context-menu-subject";
        subject.id = id;
        subject.setAttribute("role", "none");
        menu.prepend(subject);
    }
    subject.textContent = text;
    menu.removeAttribute("aria-label");
    menu.setAttribute("aria-labelledby", subject.id);
}

export class ContextMenu extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "subject-label", "open"];
    }

    #built = false;
    #wasOpen = false;
    #subjectId = nextId("lily-context-menu-subject");

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "context-menu");
            this.setAttribute("role", "menu");
            // popover="auto" with no declarative trigger (a right-click or long-press opens it, tasks.md P18-T11):
            // `open` shows it with showPopover() in the top layer; Escape and light dismiss come from the browser and
            // the toggle event writes `open` back. Positioning at the pointer stays the consumer's CSS.
            this.setAttribute("popover", "auto");
            this.addEventListener("keydown", this.#onKeydown);
            this.addEventListener("toggle", this.#onPopoverToggle);
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
        // subject-label: whose record or what the menu acts on; a non-interactive first part that names the menu.
        syncSubject(this, this.getAttribute("subject-label"), this.#subjectId, label);
        const open = this.hasAttribute("open");
        syncPopover(this, open);
        if (open && !this.#wasOpen) {
            this.querySelector<HTMLElement>("[role='menuitem']")?.focus();
        }
        this.#wasOpen = open;
    }

    #onPopoverToggle = (event: Event): void => {
        // The menu's own items fire no toggle events, so this is the menu itself.
        if (event.target === this) this.toggleAttribute("open", toggleOpened(event));
    };

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
                this.dispatchEvent(
                    new CustomEvent("lily-close", { bubbles: true, composed: true }),
                );
                break;
            }
        }
    };
}
