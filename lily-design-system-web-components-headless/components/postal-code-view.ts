// PostalCodeView component
//
// A headless read-only display of a postal or ZIP code. Companion:
// postal-code-input. NOTE: its own AGENTS.md metadata says "HTML tag:
// <div>" but its "Key Behaviors" section, the html-headless scaffold,
// and the canonical svelte-headless source all agree on a real <span>
// (matching every sibling *View component in this batch) — followed
// here as the real contract, not the stale metadata line.
//
// Attributes:
//   text — the postal code string to display, as text content. Default
//     "" (NOT "value" — this component's own text prop name, unlike
//     the "value" property most other View/Input components use).
//   ...rest — spread onto the <span>.
//
// References:
//   - components/postal-code-view/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["text"]);

export class PostalCodeView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "postal-code-view");
        span.textContent = this.getAttribute("text") ?? "";
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get text(): string {
        return this.#span?.textContent ?? this.getAttribute("text") ?? "";
    }

    set text(v: string) {
        if (this.#span) this.#span.textContent = v;
        else this.setAttribute("text", v);
    }
}
