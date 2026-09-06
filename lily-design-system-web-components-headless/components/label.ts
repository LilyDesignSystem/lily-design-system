// Label component
//
// A native <label>, optionally associated with a form control by id via
// `for`. Content is the consumer's light-DOM children (text, or the
// control itself if the consumer wraps it directly).
//
// Attributes:
//   for — optional; the id of the associated form control.
//   ...rest — spread onto the <label>.
//
// References:
//   - components/label/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["for"]);

export class Label extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > label.label")) return;

        const label = document.createElement("label");
        label.className = rootClassName(this, "label");
        const forAttr = this.getAttribute("for");
        if (forAttr !== null) label.setAttribute("for", forAttr);
        passThroughAttributes(this, label, HANDLED);

        moveChildrenInto(this, label);
        this.appendChild(label);
    }
}
