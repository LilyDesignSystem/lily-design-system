// Panel component
//
// A generic content panel: a <div role="group"> named by its required label
// (the contract's <div>; an unnamed <section> adds nothing, and a group keeps
// a page of panels out of the landmark list).
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — spread onto the <div>.
//
// References:
//   - components/panel/index.md (canonical contract)
//   - ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Panel extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > div.panel")) return;

        const root = document.createElement("div");
        root.className = rootClassName(this, "panel");
        root.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) root.setAttribute("aria-label", label);
        passThroughAttributes(this, root, HANDLED);

        moveChildrenInto(this, root);
        this.appendChild(root);
    }
}
