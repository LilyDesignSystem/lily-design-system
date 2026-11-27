// Separator component
//
// A single, void <hr role="separator"> dividing sections of content.
//
// Attributes:
//   label — optional. Accessible label describing the separation, via
//     aria-label.
//
// References:
//   - components/separator/index.md (canonical contract)
//   - WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
//   - MDN hr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr

import { passThroughAttributes, rootClassName, followLabel } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Separator extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "hr.separator", "separator");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > hr.separator")) return;

        const hr = document.createElement("hr");
        hr.className = rootClassName(this, "separator");
        hr.setAttribute("role", "separator");
        const label = this.getAttribute("label");
        if (label !== null) hr.setAttribute("aria-label", label);
        passThroughAttributes(this, hr, HANDLED);

        this.appendChild(hr);
    }
}
