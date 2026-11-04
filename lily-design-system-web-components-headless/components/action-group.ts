// ActionGroup component
//
// A <div role="group"> of action buttons that can collapse to an overflow
// menu when space is constrained. No native element behaviour is worth
// deferring to for a plain <div>, so the custom element instance itself
// stands in for the group wrapper (see lib/dom-utils.applySelfClassName);
// the overflow trigger <button> and overflow panel <div> are extra
// elements built alongside it, the same way Alert builds its heading
// <p><strong>.
//
// This catalog has no shadow root, so a real named <slot> is
// unavailable. The light-DOM equivalent used here: any direct child
// carrying slot="overflow" is moved into the overflow panel, and the
// trigger only renders when at least one such child exists — matching
// the framework ports' "the overflow trigger only renders when the
// `overflow` slot/prop is provided" contract.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   overflow-open — presence-based boolean; bindable. Reflects onto the
//     overflow trigger's aria-expanded and the overflow panel's hidden
//     attribute.
//   overflow-label — optional aria-label for the overflow trigger button.
//
// Children:
//   Visible action buttons — plain children, left in place.
//   Overflow menu content — children carrying slot="overflow".
//
// Fires a bubbling, composed "lily-overflow-toggle" CustomEvent<{ open }>
// when the overflow trigger is activated (the onOverflowToggle callback's
// equivalent).
//
// References:
//   - components/action-group/index.md (canonical contract)

import { attachToolbar } from "../lib/widget-keys.js";
import { applySelfClassName, nextId } from "../lib/dom-utils.js";
import { popoverSupported, syncPopover, toggleOpened } from "./popover.js";

export class ActionGroup extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["overflow-open", "label"];
    }

    #built = false;
    #trigger: HTMLButtonElement | null = null;
    #panel: HTMLDivElement | null = null;
    #panelId = nextId("lily-action-group-overflow-menu");

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "action-group");
        this.setAttribute("role", "group");

        const overflowChildren = Array.from(this.querySelectorAll(':scope > [slot="overflow"]'));
        if (overflowChildren.length > 0) {
            const trigger = document.createElement("button");
            trigger.type = "button";
            trigger.className = "action-group-overflow-trigger";
            trigger.setAttribute("aria-haspopup", "menu");
            trigger.textContent = "…";
            // popover="auto" (tasks.md P18-T11): command="toggle-popover" opens and closes the menu and the toggle
            // event writes `overflow-open` back. Without the API the click toggles it and syncPopover sets `hidden`.
            trigger.setAttribute("aria-controls", this.#panelId);
            trigger.setAttribute("command", "toggle-popover");
            trigger.setAttribute("commandfor", this.#panelId);
            trigger.setAttribute("popovertarget", this.#panelId);
            trigger.addEventListener("click", this.#onTriggerClick);

            const panel = document.createElement("div");
            panel.className = "action-group-overflow-menu";
            panel.id = this.#panelId;
            panel.setAttribute("popover", "auto");
            panel.addEventListener("toggle", this.#onPopoverToggle);
            for (const child of overflowChildren) panel.appendChild(child);

            this.appendChild(trigger);
            this.appendChild(panel);
            this.#trigger = trigger;
            this.#panel = panel;
        }

        this.#sync();
        attachToolbar(this);
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const trigger = this.#trigger;
        const panel = this.#panel;
        if (!trigger || !panel) return;
        const overflowLabel = this.getAttribute("overflow-label");
        if (overflowLabel !== null) trigger.setAttribute("aria-label", overflowLabel);
        const open = this.hasAttribute("overflow-open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        syncPopover(panel, open);
    }

    #onTriggerClick = (): void => {
        if (this.#panel && popoverSupported(this.#panel)) return; // the browser toggles; #onPopoverToggle reports it
        this.#setOpen(!this.hasAttribute("overflow-open"));
    };

    #onPopoverToggle = (event: Event): void => {
        this.#setOpen(toggleOpened(event));
    };

    #setOpen(next: boolean): void {
        if (next === this.hasAttribute("overflow-open")) return;
        this.toggleAttribute("overflow-open", next);
        this.dispatchEvent(
            new CustomEvent("lily-overflow-toggle", {
                detail: { open: next },
                bubbles: true,
                composed: true,
            }),
        );
    }
}
