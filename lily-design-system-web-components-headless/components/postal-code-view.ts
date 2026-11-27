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

// A change to text or class is shown (tasks.md P50-T28). Not a LiveElement: its public `text` property would hide that class's
// text() helper.
export class PostalCodeView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    connectedCallback(): void {
        if (this.#span) return;
        const span = document.createElement("span");
        this.#span = span;
        this.#show();
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }

    attributeChangedCallback(): void {
        this.#show();
    }

    #show(): void {
        if (!this.#span) return;
        this.#span.className = rootClassName(this, "postal-code-view");
        this.#span.textContent = this.getAttribute("text") ?? "";
    }

    get text(): string {
        return this.getAttribute("text") ?? "";
    }

    set text(v: string) {
        this.setAttribute("text", v);
    }
}
