// ButtonGroup component
//
// A <div role="group"> wrapper that groups related buttons together, a
// purely passive container with no internal state or behaviour. No
// native element behaviour is worth deferring to for a plain <div>, so
// the custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//
// References:
//   - components/button-group/index.md (canonical contract)

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class ButtonGroup extends HTMLElement {
    #built = false;

    // A change to label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "button-group", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "button-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
