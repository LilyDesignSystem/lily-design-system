// MockupLaptop component
//
// A decorative <div> that looks like a laptop computer, framing consumer-supplied
// content. The custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName). All visual chrome is the
// consumer's CSS — this component contributes only the class hook and
// an optional accessible name.
//
// Attributes:
//   label — optional. Accessible name describing the mockup content, via
//     aria-label.
//
// References:
//   - components/mockup-laptop/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MockupLaptop extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "mockup-laptop");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
