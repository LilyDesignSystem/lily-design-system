// CharacterCounter component
//
// A counter showing remaining or used characters in a text field. Renders
// a <span role="status" aria-live="polite"> whose text content and data
// attributes are derived from the `count` and `max` attributes.
//
// Attributes:
//   count — number, default 0. Current character count.
//   max — number, optional. Maximum allowed characters; when provided,
//     enables remaining/over-limit tracking.
//   label — optional. Accessible label via aria-label.
//
// References:
//   - components/character-counter/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["count", "max", "label"]);

export class CharacterCounter extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["count", "max", "label"];
    }

    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (!this.#span) {
            const span = document.createElement("span");
            span.className = rootClassName(this, "character-counter");
            span.setAttribute("role", "status");
            span.setAttribute("aria-live", "polite");
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

        const count = Number(this.getAttribute("count") ?? "0");
        const maxAttr = this.getAttribute("max");
        const label = this.getAttribute("label");

        if (label !== null) span.setAttribute("aria-label", label);
        else span.removeAttribute("aria-label");

        span.setAttribute("data-count", String(count));

        if (maxAttr !== null) {
            const max = Number(maxAttr);
            const remaining = max - count;
            const overLimit = count > max;
            span.textContent = `${count} / ${max}`;
            span.setAttribute("data-max", String(max));
            span.setAttribute("data-remaining", String(remaining));
            if (overLimit) span.setAttribute("data-over-limit", "true");
            else span.removeAttribute("data-over-limit");
        } else {
            span.textContent = String(count);
            span.removeAttribute("data-max");
            span.removeAttribute("data-remaining");
            span.removeAttribute("data-over-limit");
        }
    }
}
