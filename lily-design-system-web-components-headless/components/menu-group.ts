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
import { LiveElement } from "../lib/live-element.js";

// A change to label or class is shown (tasks.md P50-T28), in the group's name and its visible heading.
export class MenuGroup extends LiveElement {
    #heading: HTMLDivElement | null = null;

    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    protected update(): void {
        applySelfClassName(this, "menu-group");
        this.setAttribute("role", "group");
        const label = this.text("label");
        this.setAttribute("aria-label", label);
        if (!this.#heading) {
            this.#heading = document.createElement("div");
            this.#heading.className = "menu-group-heading";
            this.#heading.setAttribute("aria-hidden", "true");
            this.insertBefore(this.#heading, this.firstChild);
        }
        this.#heading.textContent = label;
    }
}
