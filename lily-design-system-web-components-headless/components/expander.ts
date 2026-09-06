// Expander component
//
// A disclosure control that shows or hides additional content. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName), and builds a real <button> trigger
// plus a <div role="region"> content wrapper as its own children. The
// consumer's light-DOM children (the expandable content) are moved into
// the region once, at connect time; visibility after that is toggled
// via the `hidden` content attribute rather than truly removing the
// region — equivalent for the accessibility tree, matching this
// catalog's EditableForm precedent, and it avoids repeatedly
// reparenting the consumer's content.
//
// Attributes:
//   label — REQUIRED. Button text and accessible name for both the
//     button and the content region.
//   expanded — presence-based boolean; bindable.
//
// Keyboard: Enter / Space toggle (native <button> behaviour).
//
// References:
//   - components/expander/index.md (canonical contract)
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";

export class Expander extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "expanded"];
    }

    #built = false;
    #button: HTMLButtonElement | null = null;
    #region: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "expander");

        const contentId = nextId("lily-expander-content");

        const region = document.createElement("div");
        region.id = contentId;
        region.setAttribute("role", "region");
        moveChildrenInto(this, region);
        this.#region = region;

        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-controls", contentId);
        button.addEventListener("click", this.#onClick);
        this.#button = button;

        this.appendChild(button);
        this.appendChild(region);

        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label") ?? "";
        const expanded = this.hasAttribute("expanded");

        this.#button!.textContent = label;
        this.#button!.setAttribute("aria-expanded", String(expanded));
        this.#region!.setAttribute("aria-label", label);
        this.#region!.hidden = !expanded;
    }

    #onClick = (): void => {
        this.toggleAttribute("expanded", !this.hasAttribute("expanded"));
    };
}
