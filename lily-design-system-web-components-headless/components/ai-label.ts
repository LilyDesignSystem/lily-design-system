// AiLabel component
//
// An indicator of AI instances that is a pathway to AI explainability. A
// <span> for inline placement. This is the first layer of AI
// explainability; consumers can wrap it in a button or attach a popover for
// deeper explainability content.
//
// Attributes:
//   label — accessible name via aria-label, default "AI".
//   text — visible text displayed inside the indicator, default "AI".
//
// References:
//   - components/ai-label/index.md (canonical contract)
//   - Carbon Design System AI Label: https://carbondesignsystem.com/components/ai-label/usage/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "text"]);

export class AiLabel extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "text"];
    }

    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (!this.#span) {
            const span = document.createElement("span");
            span.className = rootClassName(this, "ai-label");
            passThroughAttributes(this, span, HANDLED);
            this.appendChild(span);
            this.#span = span;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const span = this.#span;
        if (!span) return;
        span.setAttribute("aria-label", this.getAttribute("label") ?? "AI");
        span.textContent = this.getAttribute("text") ?? "AI";
    }
}
