// MockupTabletLandscape component
//
// A decorative <div> that looks like a tablet computer in landscape mode, framing consumer-supplied
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
//   - components/mockup-tablet-landscape/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class MockupTabletLandscape extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "mockup-tablet-landscape");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
