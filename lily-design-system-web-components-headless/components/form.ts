// Form component
//
// A native <form> for collecting and submitting user data. Submission's
// default is prevented so the consumer handles it without a page
// navigation; the still-dispatched, bubbling "submit" event is the
// framework ports' onsubmit callback's equivalent. Reset is left fully
// native — no interception — matching the framework ports' onreset
// pass-through.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   ...rest — spread onto the <form>.
//
// References:
//   - components/form/index.md (canonical contract)
//   - MDN <form>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Form extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > form.form")) return;

        const form = document.createElement("form");
        form.className = rootClassName(this, "form");
        const label = this.getAttribute("label");
        if (label !== null) form.setAttribute("aria-label", label);
        passThroughAttributes(this, form, HANDLED);
        form.addEventListener("submit", (event) => event.preventDefault());

        moveChildrenInto(this, form);
        this.appendChild(form);
    }
}
