// Footer component
//
// A page or section footer landmark: a native <footer>, which provides the
// contentinfo landmark role.
//
// Attributes:
//   label — optional. Accessible name to distinguish this footer from
//     others on the page, via aria-label.
//   ...rest — spread onto the <footer>.
//
// References:
//   - components/footer/index.md (canonical contract)

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Footer extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "footer.footer", "footer");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > footer.footer")) return;

        const footer = document.createElement("footer");
        footer.className = rootClassName(this, "footer");
        const label = this.getAttribute("label");
        if (label !== null) footer.setAttribute("aria-label", label);
        passThroughAttributes(this, footer, HANDLED);

        moveChildrenInto(this, footer);
        this.appendChild(footer);
    }
}
