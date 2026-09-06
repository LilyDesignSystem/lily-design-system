// MockupPhoneLandscape component
//
// A decorative <div role="img"> that looks like a mobile phone in
// landscape orientation, framing consumer-supplied content. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Unlike its sibling mockups, this one
// carries role="img" so assistive technology treats the whole frame plus
// its content as a single described image — matching the canonical
// contract's REQUIRED label.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the mockup content, via
//     aria-label.
//
// References:
//   - components/mockup-phone-landscape/index.md (canonical contract)
//   - WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img

import { applySelfClassName } from "../lib/dom-utils.js";

export class MockupPhoneLandscape extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "mockup-phone-landscape");
        this.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
