// AddressInput component
//
// An address is several fields, so this is the contract's <div role="group">,
// named by `label`, holding the consumer's labelled inputs (street, town,
// postal code, country, each with its own autocomplete token). It is the one
// `-input` component whose root is not an <input>. Any postcode lookup or
// address search is the consumer's.
//
// Attributes:
//   label — REQUIRED. The group's accessible name, via aria-label.
//   ...rest — spread onto the <div>. Children move into it unchanged.
//
// References:
//   - components/address-input/index.md (canonical contract)
//   - HTML autocomplete address tokens: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class AddressInput extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const root = this.querySelector(":scope > div.address-input");
        if (!root) return;
        root.className = rootClassName(this, "address-input");
        // An empty label names nothing, as when it is built.
        const label = this.getAttribute("label");
        if (label) root.setAttribute("aria-label", label);
        else root.removeAttribute("aria-label");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > div.address-input")) return;

        const root = document.createElement("div");
        root.className = rootClassName(this, "address-input");
        root.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label) root.setAttribute("aria-label", label);
        passThroughAttributes(this, root, HANDLED);

        moveChildrenInto(this, root);
        this.appendChild(root);
    }
}
