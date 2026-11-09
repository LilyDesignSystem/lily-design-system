// Hint component
//
// A <p> for hint/guidance text associated with a form field, as Svelte
// renders it. The consumer links it to the field via `aria-describedby`
// pointing at this component's `id`.
//
// Attributes:
//   id — optional. Element id; the target of the associated field's
//     aria-describedby.
//   ...rest — spread onto the <p>.
//
// References:
//   - components/hint/index.md (canonical contract)
//   - WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>([]);

export class Hint extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > p.hint")) return;

        const p = document.createElement("p");
        p.className = rootClassName(this, "hint");
        passThroughAttributes(this, p, HANDLED);

        moveChildrenInto(this, p);
        this.appendChild(p);
    }
}
