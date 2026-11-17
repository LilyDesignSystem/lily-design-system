// AvatarGroup component
//
// A <div role="group"> that semantically groups a set of Avatar
// components. No native element behaviour is worth deferring to for a
// plain <div>, so the custom element instance itself stands in for the
// wrapper (see lib/dom-utils.applySelfClassName). Purely presentational
// otherwise: overlap, spacing, and truncation are the consumer's CSS.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//
// References:
//   - components/avatar-group/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class AvatarGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "avatar-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        // overflow-label: the consumer's words for the avatars not shown ("and 12 more"), rendered last.
        const overflow = this.getAttribute("overflow-label");
        if (overflow) {
            const span = document.createElement("span");
            span.className = "avatar-group-overflow";
            span.textContent = overflow;
            this.append(span);
        }
    }
}
