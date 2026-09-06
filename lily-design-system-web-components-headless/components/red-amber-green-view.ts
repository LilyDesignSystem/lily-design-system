// RedAmberGreenView component
//
// A headless read-only display of a red/amber/green status. Companion:
// red-amber-green-picker. Same `<span aria-label>` display shape as
// AlbaCommunityHealthIndexView, adjusted for this component's own
// `value` default of "".
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via
//     aria-label.
//   value — the RAG status to display (e.g. "red", "amber", "green"),
//     as text content. Default "".
//   ...rest — spread onto the <span>.
//
// References:
//   - components/red-amber-green-view/index.md (canonical contract)
//   - RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class RedAmberGreenView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "red-amber-green-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.textContent = this.getAttribute("value") ?? "";
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#span?.textContent ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#span) this.#span.textContent = v;
        else this.setAttribute("value", v);
    }
}
