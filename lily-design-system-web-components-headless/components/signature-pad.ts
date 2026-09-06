// SignaturePad component
//
// A native <canvas role="application"> drawing surface for capturing a
// handwritten signature. Treated as a leaf element (like AvatarImage): no
// drawing logic is implemented here — that is the consumer's job per the
// headless behaviour-boundary rule — this component ships only the
// semantic element and its accessible name.
//
// Attributes:
//   label — REQUIRED. Accessible description of the signature field, via
//     aria-label.
//
// References:
//   - components/signature-pad/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SignaturePad extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > canvas.signature-pad")) return;

        const canvas = document.createElement("canvas");
        canvas.className = rootClassName(this, "signature-pad");
        canvas.setAttribute("role", "application");
        const label = this.getAttribute("label");
        if (label !== null) canvas.setAttribute("aria-label", label);
        passThroughAttributes(this, canvas, HANDLED);

        this.appendChild(canvas);
    }
}
