// IconList component
//
// A list of IconListItem components, each with a leading icon.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ul>.
//
// References:
//   - components/icon-list/index.md (canonical contract)
//   - US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class IconList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.icon-list")) return;

        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "icon-list");
        const label = this.getAttribute("label");
        if (label !== null) ul.setAttribute("aria-label", label);
        passThroughAttributes(this, ul, HANDLED);

        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
