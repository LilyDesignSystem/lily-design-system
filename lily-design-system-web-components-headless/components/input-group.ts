// InputGroup component
//
// A <div role="group"> wrapping a consumer-supplied input with optional
// prefix/suffix addons. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// Prefix and suffix are "slots" per the canonical contract; since this
// catalog is light-DOM only (no shadow root, no real <slot>), a slotted
// child is marked `slot="prefix"` / `slot="suffix"` and this component
// distributes it into the matching addon <span> — the same convention
// FeaturePhoto uses for its caption/credit slots.
//
// Attributes:
//   label — optional; aria-label for the group.
//
// Usage:
//   <lily-input-group label="Amount">
//     <span slot="prefix">$</span>
//     <input type="number">
//     <span slot="suffix">USD</span>
//   </lily-input-group>
//
// References:
//   - components/input-group/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class InputGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "input-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const prefixContent = this.querySelector(':scope > [slot="prefix"]');
        if (prefixContent) {
            const prefix = document.createElement("span");
            prefix.className = "input-group-prefix";
            prefix.appendChild(prefixContent);
            this.insertBefore(prefix, this.firstChild);
        }

        const suffixContent = this.querySelector(':scope > [slot="suffix"]');
        if (suffixContent) {
            const suffix = document.createElement("span");
            suffix.className = "input-group-suffix";
            suffix.appendChild(suffixContent);
            this.appendChild(suffix);
        }
    }
}
