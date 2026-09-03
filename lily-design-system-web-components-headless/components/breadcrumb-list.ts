// BreadcrumbList component
//
// The <ol> inside a BreadcrumbNav. Part of the P8-T7 pilot for the
// *List/*ListItem families in this catalog.
//
// Content model matters here: an <ol> may contain only <li> children
// (HTML content model; axe rules `list` / `listitem`). This component
// therefore relies on BreadcrumbListItem's "upgrade in place" pattern —
// each <lily-breadcrumb-list-item> child replaces ITSELF with a real
// <li> when it upgrades, so no custom-element host ever sits between
// this <ol> and its <li> children. Parser order guarantees the outer
// list upgrades first (moving the not-yet-upgraded item hosts into the
// <ol>), then each item upgrades and swaps itself out.
//
// Attributes: none of its own; everything passes through to the <ol>.
//
// References:
//   - components/breadcrumb-list/index.md (canonical contract)
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class BreadcrumbList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.breadcrumb-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "breadcrumb-list");
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
