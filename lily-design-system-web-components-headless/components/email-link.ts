// EmailLink component
//
// A mailto hyperlink for an email address. The email address is displayed
// as the link's visible text content.
//
// Attributes:
//   email — REQUIRED. The email address to display and link to.
//   label — optional accessible label override, via aria-label.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/email-link/index.md (canonical contract)
//   - MDN mailto: links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["email", "label"]);

export class EmailLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.email-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "email-link");
        const email = this.getAttribute("email");
        if (email !== null) {
            a.href = `mailto:${email}`;
            a.textContent = email;
        }
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        this.appendChild(a);
    }
}
