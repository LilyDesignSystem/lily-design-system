// HamburgerMenu component
//
// A toggle <button> that reveals or hides a navigation panel, commonly
// used on mobile layouts. Deviation note: the Svelte/React/Vue ports
// render an outer <div> wrapping the button AND an inline <nav> that
// only exists while open; the HTML, Nunjucks, and Blazor ports (and this
// catalog's own AGENTS.md "HTML tag" field) instead render a single
// <button> and leave the navigation region to the consumer, referenced
// by aria-controls — the only structure a native <button> can validly
// hold is phrasing content, not a <nav> landmark's flow content. This
// component follows the button-only idiom: it toggles its own
// aria-expanded and, where aria-controls resolves to an existing
// element, that element's `hidden` attribute, but does not create or own
// a <nav> itself.
//
// Attributes:
//   label — accessible name, via aria-label. Default "Menu".
//   open — presence-based boolean; bindable (`el.toggleAttribute("open")`
//     works both ways), reflected as aria-expanded on the button.
//   aria-controls — optional; passed through to reference an externally
//     rendered navigation region's id. When that element exists, its
//     `hidden` attribute is kept in sync with the closed state.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ open: boolean }>
// whenever the state changes by user interaction.
//
// Keyboard: Enter/Space toggle (native <button> behaviour).
//
// References:
//   - components/hamburger-menu/index.md (canonical contract)
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "open"]);

export class HamburgerMenu extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #button: HTMLButtonElement | null = null;

    connectedCallback(): void {
        if (this.#button) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "hamburger-menu");
        passThroughAttributes(this, button, HANDLED);
        button.addEventListener("click", this.#onClick);

        moveChildrenInto(this, button);
        this.appendChild(button);
        this.#button = button;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const button = this.#button;
        if (!button) return;
        button.setAttribute("aria-label", this.getAttribute("label") ?? "Menu");
        const open = this.hasAttribute("open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
        const controls = button.getAttribute("aria-controls");
        if (controls) {
            const target = document.getElementById(controls);
            if (target) target.hidden = !open;
        }
    }

    #onClick = (): void => {
        const next = !this.hasAttribute("open");
        this.toggleAttribute("open", next);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { open: next }, bubbles: true, composed: true }),
        );
    };
}
