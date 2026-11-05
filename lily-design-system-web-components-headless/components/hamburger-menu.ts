// HamburgerMenu component
//
// A <div> holding a toggle <button> and the <nav> it reveals, commonly used
// on mobile layouts. The element's children become the navigation content.
// Deviation note: the Svelte, React and Vue ports render the <nav> only while
// open; here, as in the HTML, Nunjucks and Alpine ports, it stays in the DOM
// and is `hidden` while closed, because light-DOM children have nowhere else
// to wait.
//
// Attributes:
//   label — names the button and the navigation. Required: the words are yours.
//   open — presence-based boolean; bindable (`el.toggleAttribute("open")`
//     works both ways), reflected as aria-expanded on the button.
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

import {
    moveChildrenInto,
    nextId,
    passThroughAttributes,
    rootClassName,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "open"]);

export class HamburgerMenu extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #button: HTMLButtonElement | null = null;
    #nav: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#button) return;

        const root = document.createElement("div");
        root.className = rootClassName(this, "hamburger-menu");
        passThroughAttributes(this, root, HANDLED);

        const nav = document.createElement("nav");
        nav.className = "hamburger-menu-nav";
        nav.id = nextId("hamburger-menu-nav");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "hamburger-menu-button";
        button.setAttribute("aria-controls", nav.id);
        button.addEventListener("click", this.#onClick);

        moveChildrenInto(this, nav);
        root.append(button, nav);
        this.appendChild(root);
        this.#button = button;
        this.#nav = nav;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const button = this.#button;
        const nav = this.#nav;
        if (!button || !nav) return;
        const label = this.getAttribute("label");
        if (label !== null) {
            button.setAttribute("aria-label", label);
            button.textContent = label;
            nav.setAttribute("aria-label", label);
        }
        const open = this.hasAttribute("open");
        button.setAttribute("aria-expanded", open ? "true" : "false");
        nav.hidden = !open;
    }

    #onClick = (): void => {
        const next = !this.hasAttribute("open");
        this.toggleAttribute("open", next);
        this.dispatchEvent(
            new CustomEvent("lily-change", {
                detail: { open: next },
                bubbles: true,
                composed: true,
            }),
        );
    };
}
