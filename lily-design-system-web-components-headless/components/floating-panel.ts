// FloatingPanel component
//
// A panel that overlays page content (tooltip, popover, dropdown menu,
// contextual UI), rendered only when `open` is present. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Since this catalog has no runtime
// conditional-rendering mechanism, "only when open" is realised as
// `role`/`aria-label` present only while open, plus the `hidden`
// attribute reflecting !open (removing the panel from the accessibility
// tree and hit-testing, the closest equivalent to the other frameworks'
// full DOM removal).
//
// Attributes:
//   open — presence-based boolean; bindable
//     (`el.toggleAttribute("open")`); default false (closed).
//   label — REQUIRED. Accessible name for the panel region, via
//     aria-label — set only while open.
//
// References:
//   - components/floating-panel/index.md (canonical contract)
//   - WAI-ARIA Practices - Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import { applySelfClassName } from "../lib/dom-utils.js";

export class FloatingPanel extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "floating-panel");
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
            this.setAttribute("role", "region");
            const label = this.getAttribute("label");
            if (label !== null) this.setAttribute("aria-label", label);
        } else {
            this.removeAttribute("role");
            this.removeAttribute("aria-label");
        }
    }
}
