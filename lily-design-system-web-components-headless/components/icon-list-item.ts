// IconListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). A <ul> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Since this catalog uses light DOM (no shadow root) there is no real
// <slot>: the optional decorative icon is a light-DOM child marked
// `slot="icon"`, the same technique feature-photo.ts uses for its
// caption/credit slots. Everything else moves into a
// <span class="icon-list-item-text">, matching the canonical contract's
// two-span shape.
//
// Attributes:
//   ...rest — spread onto the <li>.
//
// Usage:
//   <lily-icon-list-item>
//     <span slot="icon">★</span>
//     Benefit description
//   </lily-icon-list-item>
//
// References:
//   - components/icon-list-item/index.md (canonical contract)
//   - US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class IconListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "icon-list-item");
        passThroughAttributes(this, li, HANDLED);

        const iconSlot = this.querySelector(':scope > [slot="icon"]');
        if (iconSlot) {
            const iconSpan = document.createElement("span");
            iconSpan.className = "icon-list-item-icon";
            iconSpan.setAttribute("aria-hidden", "true");
            iconSlot.removeAttribute("slot");
            iconSpan.appendChild(iconSlot);
            li.appendChild(iconSpan);
        }

        const textSpan = document.createElement("span");
        textSpan.className = "icon-list-item-text";
        moveChildrenInto(this, textSpan);
        li.appendChild(textSpan);

        this.replaceWith(li);
    }
}
