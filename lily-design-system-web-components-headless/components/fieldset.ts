// Fieldset component
//
// A native <fieldset> with a <legend> child for semantic form grouping.
// No custom ARIA is needed — the native elements provide group semantics
// and labelling on their own, and the native `disabled` attribute
// propagates to every descendant control for free.
//
// Attributes:
//   legend — REQUIRED. Text for the <legend> element.
//   disabled — presence-based boolean.
//
// References:
//   - components/fieldset/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["legend", "disabled"]);

export class Fieldset extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.fieldset")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "fieldset");
        if (this.hasAttribute("disabled")) fieldset.disabled = true;
        passThroughAttributes(this, fieldset, HANDLED);

        const legend = document.createElement("legend");
        legend.textContent = this.getAttribute("legend") ?? "";
        fieldset.appendChild(legend);

        moveChildrenInto(this, fieldset);
        this.appendChild(fieldset);
    }
}
