// ContextualHelp component
//
// A <div class="contextual-help"> disclosure: a trigger button that opens
// a panel of supplementary content. The custom element itself stands in
// for the wrapper div (see lib/dom-utils.applySelfClassName) — its own
// light-DOM content is the panel body, moved into the generated panel
// element at connect time.
//
// The panel is popover="auto" and the trigger names it with
// command="toggle-popover" commandfor (and popovertarget, for engines before
// command/commandfor): the browser opens it, and closes it on Escape and on a
// click outside it (light dismiss). The panel's `toggle` event writes the
// state back to `expanded`. Where the Popover API is missing (jsdom, old
// engines) the trigger's click toggles `expanded` and the panel's `hidden`.
//
// Attributes:
//   label — REQUIRED. Accessible name for the trigger, via aria-label.
//   trigger-label — REQUIRED. Visible text of the trigger, such as "?" or
//     "؟". No default: the glyph is the consumer's; leave it empty when CSS
//     draws an icon.
//   expanded — presence-based boolean; bindable.
//
// Fires a bubbling, composed "lily-click" CustomEvent when the trigger is
// activated (after this component's own fallback toggling has run).
//
// References:
//   - components/contextual-help/index.md (canonical contract)
//   - HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command

import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";
import { popoverSupported, syncPopover, toggleOpened } from "./popover.js";

export class ContextualHelp extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["expanded", "label", "trigger-label"];
    }

    #trigger: HTMLButtonElement | null = null;
    #panel: HTMLDivElement | null = null;
    #panelId = nextId("lily-contextual-help-panel");

    connectedCallback(): void {
        if (this.#trigger) return;

        applySelfClassName(this, "contextual-help");

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "contextual-help-trigger";
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-controls", this.#panelId);
        trigger.setAttribute("command", "toggle-popover");
        trigger.setAttribute("commandfor", this.#panelId);
        trigger.setAttribute("popovertarget", this.#panelId);
        trigger.addEventListener("click", this.#onTriggerClick);

        const panel = document.createElement("div");
        panel.className = "contextual-help-panel";
        panel.id = this.#panelId;
        panel.setAttribute("role", "dialog");
        panel.setAttribute("popover", "auto");
        panel.addEventListener("toggle", this.#onToggle);
        moveChildrenInto(this, panel);

        this.appendChild(trigger);
        this.appendChild(panel);
        this.#trigger = trigger;
        this.#panel = panel;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#trigger || !this.#panel) return;
        const label = this.getAttribute("label");
        if (label !== null) {
            this.#trigger.setAttribute("aria-label", label);
            this.#panel?.setAttribute("aria-label", label);
        }
        this.#trigger.textContent = this.getAttribute("trigger-label") ?? "";
        const expanded = this.hasAttribute("expanded");
        this.#trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
        syncPopover(this.#panel, expanded);
    }

    #onTriggerClick = (event: MouseEvent): void => {
        // With the Popover API the browser toggles the panel (command / popovertarget) and #onToggle follows it.
        if (!event.defaultPrevented && this.#panel && !popoverSupported(this.#panel)) {
            this.toggleAttribute("expanded", !this.hasAttribute("expanded"));
        }
        this.dispatchEvent(new CustomEvent("lily-click", { bubbles: true, composed: true }));
    };

    #onToggle = (event: Event): void => {
        this.toggleAttribute("expanded", toggleOpened(event));
    };
}
