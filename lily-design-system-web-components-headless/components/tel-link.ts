// TelLink component
//
// A tel hyperlink for a telephone number. The phone number is displayed as
// the link's visible text content.
//
// Attributes:
//   phone — REQUIRED. The phone number to display and link to (include
//     country code, e.g. "+1-555-0100").
//   label — optional accessible name override, via aria-label, for
//     additional context beyond the bare phone number.
//   ...rest — spread onto the <a>.
//
// References:
//   - components/tel-link/index.md (canonical contract)
//   - MDN tel: links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_telephone_numbers

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["phone", "label"]);

export class TelLink extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.tel-link")) return;

        const a = document.createElement("a");
        a.className = rootClassName(this, "tel-link");
        const phone = this.getAttribute("phone");
        if (phone !== null) {
            a.href = `tel:${phone}`;
            a.textContent = phone;
        }
        const label = this.getAttribute("label");
        if (label !== null) a.setAttribute("aria-label", label);
        passThroughAttributes(this, a, HANDLED);

        this.appendChild(a);
    }
}
