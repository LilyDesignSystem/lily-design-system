// BreadcrumbListItem component — the P8-T7 "upgrade in place" pilot.
//
// The problem this solves (spec/index.md §2, "Explicitly out of scope"):
// an <ol> may contain only <li> children, but every other component in
// this catalog wraps its real element inside its custom-element host,
// which would put <lily-breadcrumb-list-item> between <ol> and <li> —
// exactly the wrapper-host defect angular-headless 0.3.0 fixed with a
// tag+attribute selector (`li[lily-breadcrumb-list-item]`). Autonomous
// custom elements have no such selector, and customized built-ins
// (`<li is="...">`) are permanently unsupported in WebKit.
//
// The pattern: on upgrade, build the real <li>, move the host's
// children and attributes into it, then `this.replaceWith(li)` — the
// host removes ITSELF from the tree. What remains is a pure
// <ol> > <li> structure with no wrapper at all.
//
// The accepted cost, stated plainly: after upgrade there is no custom
// element instance left, so there is no attributeChangedCallback and no
// live reactivity. That is a real trade-off, and it is acceptable HERE
// because the canonical contract says this component is passive ("No
// keyboard interactions", `Interactive: no`): its only state is a
// one-shot `current` flag read at upgrade. It would NOT be acceptable
// for an interactive list item, and the pattern must not be copied to
// one without revisiting that.
//
// Attributes:
//   current — presence-based boolean; sets aria-current="page".
//   ...rest — spread onto the <li>.
//
// References:
//   - components/breadcrumb-list-item/index.md (canonical contract)
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["current"]);

export class BreadcrumbListItem extends HTMLElement {
    connectedCallback(): void {
        // Guard: replaceWith() below disconnects this host, which can
        // re-enter here in some engines; never upgrade twice.
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "breadcrumb-list-item");
        if (this.hasAttribute("current")) li.setAttribute("aria-current", "page");
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
