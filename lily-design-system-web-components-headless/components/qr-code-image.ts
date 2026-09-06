// QrCodeImage component
//
// A <div role="img"> container for a QR code generated from text or URL
// data. The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). The consumer provides the actual
// QR code rendering (SVG, canvas, or a library's output) as children.
//
// Attributes:
//   label — REQUIRED. Accessible description of the QR code content,
//     via aria-label.
//
// References:
//   - components/qr-code-image/index.md (canonical contract)
//   - WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img

import { applySelfClassName } from "../lib/dom-utils.js";

export class QrCodeImage extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "qr-code-image");
        this.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
