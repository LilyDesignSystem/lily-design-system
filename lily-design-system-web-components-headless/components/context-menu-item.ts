// ContextMenuItem component
//
// One item in a ContextMenu. A <div role="menuitem" tabindex="-1"> — the
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. tabindex="-1" supports roving
// focus managed by the parent ContextMenu (ArrowUp/ArrowDown). Must be
// placed inside a role="menu" container.
//
// References:
//   - components/context-menu-item/index.md (canonical contract)
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class ContextMenuItem extends HTMLElement {
    #built = false;

    // A change to class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "context-menu-item", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "context-menu-item");
        this.setAttribute("role", "menuitem");
        this.tabIndex = -1;
    }
}
