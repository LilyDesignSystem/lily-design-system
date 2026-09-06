// GovernmentBanner component
//
// A native <aside> identifying a website as belonging to a government, with
// an expandable details panel. Unlike the `<div>`-tagged banners in this
// catalog, `<aside>` is a real element worth rendering for real, so this
// component wraps a generated <aside> (pattern 1) rather than standing in
// for it.
//
// Attributes:
//   label — REQUIRED. Accessible name for the aside landmark, via
//     aria-label.
//   header-text — REQUIRED. Rendered in
//     <span class="government-banner-text"> inside the header.
//   expand-label — REQUIRED. Rendered as the toggle button's text content.
//   expanded — presence-based boolean; bindable. Controls the details
//     panel's visibility.
//
// Fires a bubbling, composed "lily-toggle" CustomEvent when the toggle
// button is activated (after this component's own expanded-toggling has
// run).
//
// References:
//   - components/government-banner/index.md (canonical contract)

import { moveChildrenInto, nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "header-text", "expand-label", "expanded"]);

export class GovernmentBanner extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["expanded", "label", "header-text", "expand-label"];
    }

    #aside: HTMLElement | null = null;
    #headerText: HTMLElement | null = null;
    #toggle: HTMLButtonElement | null = null;
    #panel: HTMLElement | null = null;
    #panelId = nextId("lily-government-banner-panel");

    connectedCallback(): void {
        if (this.#aside) {
            this.#sync();
            return;
        }

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "government-banner");
        passThroughAttributes(this, aside, HANDLED);

        const header = document.createElement("header");
        header.className = "government-banner-header";

        const span = document.createElement("span");
        span.className = "government-banner-text";
        header.appendChild(span);

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "government-banner-toggle";
        toggle.setAttribute("aria-controls", this.#panelId);
        toggle.addEventListener("click", this.#onToggle);
        header.appendChild(toggle);

        aside.appendChild(header);

        const panel = document.createElement("div");
        panel.id = this.#panelId;
        panel.className = "government-banner-details";
        moveChildrenInto(this, panel);
        aside.appendChild(panel);

        this.appendChild(aside);
        this.#aside = aside;
        this.#headerText = span;
        this.#toggle = toggle;
        this.#panel = panel;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const aside = this.#aside;
        if (!aside || !this.#headerText || !this.#toggle || !this.#panel) return;

        const label = this.getAttribute("label");
        if (label !== null) aside.setAttribute("aria-label", label);

        this.#headerText.textContent = this.getAttribute("header-text") ?? "";
        this.#toggle.textContent = this.getAttribute("expand-label") ?? "";

        const expanded = this.hasAttribute("expanded");
        this.#toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        this.#panel.hidden = !expanded;
    }

    #onToggle = (): void => {
        this.toggleAttribute("expanded", !this.hasAttribute("expanded"));
        this.dispatchEvent(new CustomEvent("lily-toggle", { bubbles: true, composed: true }));
    };
}
