// MenuGroup component
//
// A labeled section of menu items within a menu (Adobe Spectrum-inspired).
// A <div role="group">; the custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// Attributes:
//   label — REQUIRED. Section heading text and aria-label.
//
// Usage:
//   <lily-menu-group label="File">
//     <!-- consumer's menu-item children -->
//   </lily-menu-group>
//
// References:
//   - components/menu-group/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MenuGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "menu-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label") ?? "";
        this.setAttribute("aria-label", label);

        const heading = document.createElement("div");
        heading.className = "menu-group-heading";
        heading.setAttribute("aria-hidden", "true");
        heading.textContent = label;
        this.insertBefore(heading, this.firstChild);
    }
}
