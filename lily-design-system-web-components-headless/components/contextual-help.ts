// ContextualHelp component
//
// A <div class="contextual-help"> disclosure: a trigger button that opens
// a panel of supplementary content. The custom element itself stands in
// for the wrapper div (see lib/dom-utils.applySelfClassName) — its own
// light-DOM content is the panel body, moved into the generated panel
// element at connect time.
//
// Attributes:
//   label — REQUIRED. Accessible name for the trigger, via aria-label.
//   expanded — presence-based boolean; bindable.
//
// Fires a bubbling, composed "lily-click" CustomEvent when the trigger is
// activated (after this component's own expanded-toggling has run).
//
// References:
//   - components/contextual-help/index.md (canonical contract)

import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";

export class ContextualHelp extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["expanded", "label"];
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
        trigger.addEventListener("click", this.#onTriggerClick);

        const panel = document.createElement("div");
        panel.className = "contextual-help-panel";
        panel.id = this.#panelId;
        panel.setAttribute("role", "dialog");
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
        if (label !== null) this.#trigger.setAttribute("aria-label", label);
        const expanded = this.hasAttribute("expanded");
        this.#trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
        this.#panel.hidden = !expanded;
    }

    #onTriggerClick = (): void => {
        this.toggleAttribute("expanded", !this.hasAttribute("expanded"));
        this.dispatchEvent(new CustomEvent("lily-click", { bubbles: true, composed: true }));
    };
}
