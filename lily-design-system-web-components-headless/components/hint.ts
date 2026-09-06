// Hint component
//
// A <span> for hint/guidance text associated with a form field. The
// consumer links it to the associated field via `aria-describedby`
// pointing at this component's `id`.
//
// Attributes:
//   id — optional. Element id; the target of the associated field's
//     aria-describedby.
//   ...rest — spread onto the <span>.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): this component's own index.md Implementation Notes say
// "Renders a <p> element", which conflicts with its own Metadata
// ("HTML tag: <span>"), its own Testing section ("Verify … renders a
// <span> element"), and the static html-headless port (`<span
// class="hint">`). <span> is followed here per this batch's instruction
// to cross-check html-headless when a component's own AGENTS.md is
// internally inconsistent.
//
// References:
//   - components/hint/index.md (canonical contract)
//   - WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>([]);

export class Hint extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.hint")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "hint");
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
