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
    // A change to email, label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["email", "label", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLAnchorElement>(":scope > a.email-link");
        if (!el) return;
        el.className = rootClassName(this, "email-link");
        const email = this.getAttribute("email");
        if (email !== null) {
            el.href = `mailto:${email}`;
            el.textContent = email;
        } else {
            el.removeAttribute("href");
            el.textContent = "";
        }
        const label = this.getAttribute("label");
        if (label !== null) el.setAttribute("aria-label", label);
        else el.removeAttribute("aria-label");
    }

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
