// RedAmberGreenView component
//
// A headless read-only display of a red/amber/green status. Companion:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
// AlbaCommunityHealthIndexView, adjusted for this component's own
// `value` default of "".
//
// Attributes:
//   label — REQUIRED. Accessible label for screen readers, via
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
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
    #text: Text | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "red-amber-green-view");
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.getAttribute("value") ?? "");
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.setAttribute("value", v);
    }
}
