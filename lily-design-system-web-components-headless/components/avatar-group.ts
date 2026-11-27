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
import { setOrRemove } from "../lib/live-element.js";

export class AvatarGroup extends HTMLElement {
    #built = false;

    // A change to label, overflow-label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "overflow-label", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (!this.#built) return;
        if (name === "class") {
            if (!this.classList.contains("avatar-group")) applySelfClassName(this, "avatar-group");
            return;
        }
        setOrRemove(this, "aria-label", this.getAttribute("label"));
        const overflow = this.getAttribute("overflow-label");
        let span = this.querySelector<HTMLSpanElement>(":scope > .avatar-group-overflow");
        if (!overflow) span?.remove();
        else {
            if (!span) {
                span = document.createElement("span");
                span.className = "avatar-group-overflow";
            }
            span.textContent = overflow;
            // Rendered last, after the avatars.
            this.append(span);
        }
    }

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
