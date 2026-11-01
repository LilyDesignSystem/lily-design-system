// WarningText component
//
// A short warning: an optional decorative icon and one bold line of text (the GOV.UK and DHCW
// warning-text pattern). The canonical root is a plain <div>, so the custom element stands in
// for it directly (see lib/dom-utils.applySelfClassName) and keeps its own attributes as the
// rest props.
//
// Light DOM has no real <slot>: the optional icon is a child marked `slot="icon"` (the
// icon-list-item technique). It moves into <span class="warning-text-icon" aria-hidden="true">;
// every other child (the consumer's visually hidden prefix, then the text) moves into
// <strong class="warning-text-text">. Lily bundles no icon and no strings.
//
// Usage:
//   <lily-warning-text>
//     <span slot="icon">!</span>
//     <span class="visually-hidden">Warning</span> You can be fined if you do not register.
//   </lily-warning-text>
//
// References:
//   - components/warning-text/index.md (canonical contract)
//   - GOV.UK Warning text: https://design-system.service.gov.uk/components/warning-text/

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class WarningText extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "warning-text");

        const iconSource = this.querySelector(':scope > [slot="icon"]');
        let icon: HTMLElement | null = null;
        if (iconSource) {
            icon = document.createElement("span");
            icon.className = "warning-text-icon";
            icon.setAttribute("aria-hidden", "true");
            iconSource.removeAttribute("slot");
            icon.appendChild(iconSource);
        }

        const strong = document.createElement("strong");
        strong.className = "warning-text-text";
        moveChildrenInto(this, strong);

        if (icon) this.appendChild(icon);
        this.appendChild(strong);
    }
}
