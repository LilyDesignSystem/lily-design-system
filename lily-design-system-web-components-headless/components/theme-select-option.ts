// ThemeSelectOption component — "upgrade in place", not the general
// pattern 1/2 shape.
//
// DEVIATION FLAG: the canonical HTML tag is <option>, which (like <li>
// inside <ol>, the P8-T7 BreadcrumbListItem pilot) has a content-model
// constraint pattern 1 cannot satisfy: a <select> only recognises
// <option>/<optgroup> DIRECT children for its native dropdown rendering,
// so wrapping the real <option> inside a <lily-theme-select-option> host
// element (pattern 1's usual shape) would put a non-option node between
// <select> and <option> — the same class of wrapper-host defect
// angular-headless 0.3.0 and the breadcrumb pilot both had to solve.
// This follows the identical fix: on connect, build the real <option>,
// move this host's children/attributes into it, then `this.replaceWith`
// so no host node ever sits between <select> and <option>.
//
// The accepted cost is the same one BreadcrumbListItem's file documents:
// no attributeChangedCallback / live reactivity survives the upgrade.
// That is acceptable here because — exactly like BreadcrumbListItem's
// `current` flag — this component's own contract is a one-shot read at
// upgrade: `value`/`disabled`/content never need to change after mount
// under the documented Props, and *selection* is owned by the parent
// <select>'s `value`, not by this element re-rendering itself.
//
// Attributes:
//   value — submitted when this option is selected, default "".
//   disabled — presence-based boolean.
//   ...rest — spread onto the <option>.
//
// References:
//   - components/theme-select-option/index.md (canonical contract)
//   - components/breadcrumb-list-item.ts (the P8-T7 upgrade-in-place precedent)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["value", "disabled"]);

export class ThemeSelectOption extends HTMLElement {
    connectedCallback(): void {
        // Guard: replaceWith() below disconnects this host, which can
        // re-enter here in some engines; never upgrade twice.
        if (!this.isConnected) return;

        const option = document.createElement("option");
        option.className = rootClassName(this, "theme-select-option");
        const value = this.getAttribute("value");
        if (value !== null) option.value = value;
        if (this.hasAttribute("disabled")) option.disabled = true;
        passThroughAttributes(this, option, HANDLED);

        moveChildrenInto(this, option);
        this.replaceWith(option);
    }
}
