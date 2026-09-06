// MutuallyExclusive component
//
// A <fieldset> grouping a set of selectable controls (typically
// checkboxes) that the consumer wires to behave like a radio group while
// still allowing the user to leave the group with no selection. The
// grouping semantics come from the native <fieldset>; the mutual-exclusion
// behaviour itself is the consumer's own change-handler logic (matching
// every other framework's port — this component renders the group, it
// does not intercept its children's change events).
//
// Attributes:
//   label — optional. Accessible name for the group, via aria-label.
//   ...rest — spread onto the <fieldset>.
//
// References:
//   - components/mutually-exclusive/index.md (canonical contract)
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class MutuallyExclusive extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > fieldset.mutually-exclusive")) return;

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "mutually-exclusive");
        const label = this.getAttribute("label");
        if (label !== null) fieldset.setAttribute("aria-label", label);
        passThroughAttributes(this, fieldset, HANDLED);

        moveChildrenInto(this, fieldset);
        this.appendChild(fieldset);
    }
}
