// Icon component
//
// A <span> wrapper around icon content (a text glyph, SVG, or other
// markup the consumer supplies as children) with proper accessibility
// semantics for meaningful vs. decorative icons.
//
// Attributes:
//   label — optional. Accessible name via aria-label for a meaningful
//     icon; sets role="img".
//   decorative — presence-based boolean. When present, sets
//     aria-hidden="true" and omits role entirely (icon skipped by AT).
//   ...rest — spread onto the <span>.
//
// References:
//   - components/icon/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
//   - WAI-ARIA Practices - Images: https://www.w3.org/WAI/tutorials/images/decorative/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "decorative"]);

export class Icon extends HTMLElement {
    // A change to decorative, label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["decorative", "label", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLSpanElement>(":scope > span.icon");
        if (!el) return;
        el.className = rootClassName(this, "icon");
        if (this.hasAttribute("decorative")) {
            el.setAttribute("aria-hidden", "true");
            el.removeAttribute("role");
            el.removeAttribute("aria-label");
        } else {
            el.setAttribute("role", "img");
            el.removeAttribute("aria-hidden");
            setOrRemove(el, "aria-label", this.getAttribute("label"));
        }
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > span.icon")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "icon");
        if (this.hasAttribute("decorative")) {
            span.setAttribute("aria-hidden", "true");
        } else {
            span.setAttribute("role", "img");
            const label = this.getAttribute("label");
            if (label !== null) span.setAttribute("aria-label", label);
        }
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
