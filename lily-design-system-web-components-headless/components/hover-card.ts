// HoverCard component
//
// Supplementary content displayed when triggered by hover or focus on a
// separate trigger element, rendered only when `open` is present. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Since this catalog has no runtime
// conditional-rendering mechanism, "only when open" is realised as
// `role`/`aria-label` present only while open, plus the `hidden`
// attribute reflecting !open — the closest equivalent to the other
// frameworks' full DOM removal.
//
// Attributes:
//   open — presence-based boolean; bindable
//     (`el.toggleAttribute("open")`); default false (closed). The
//     consumer manages hover/focus events on the trigger element to
//     toggle this attribute.
//   label — REQUIRED. Accessible name for the hover card, via
//     aria-label — set only while open.
//
// References:
//   - components/hover-card/index.md (canonical contract)
//   - WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
//   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

import { applySelfClassName } from "../lib/dom-utils.js";

export class HoverCard extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "hover-card");
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const open = this.hasAttribute("open");
        this.hidden = !open;
        if (open) {
            this.setAttribute("role", "tooltip");
            const label = this.getAttribute("label");
            if (label !== null) this.setAttribute("aria-label", label);
        } else {
            this.removeAttribute("role");
            this.removeAttribute("aria-label");
        }
    }
}
