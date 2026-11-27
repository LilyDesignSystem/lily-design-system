// Tag component
//
// A keyword label for categorizing content. Wraps a real
// <span role="status">.
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers: screen-reader
//     text (class screen-reader-span) by default, or aria-label when live.
//   live — presence-based boolean. Renders a role="status" live region, for
//     a tag whose text changes in place. Off by default.
//
// References:
//   - components/tag/index.md (canonical contract)
//   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["label", "live"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class Tag extends LiveElement {
    #label: HTMLSpanElement | null = null;

    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.tag");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "tag");
        if (!existing) {
            passThroughAttributes(this, span, HANDLED);
            moveChildrenInto(this, span);
        }
        const label = this.getAttribute("label");
        this.#label?.remove();
        this.#label = null;
        if (this.hasAttribute("live")) {
            span.setAttribute("role", "status");
            setOrRemove(span, "aria-label", label);
        } else {
            span.removeAttribute("role");
            span.removeAttribute("aria-label");
            // Not a live region: aria-label is not allowed on a plain <span>, so the label is screen-reader text appended after the
            // content (the themes hide .screen-reader-span). The content stays exposed: it may hold a focusable control, such as a
            // remove button.
            if (label) {
                this.#label = part("screen-reader-span", label);
                span.append(this.#label);
            }
        }
        if (!existing) this.appendChild(span);
    }
}
