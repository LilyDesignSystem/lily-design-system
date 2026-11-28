// The shared base of the national identifier views (tasks.md P48-T10): a read-only <span> showing one identifier as text, with an
// optional hidden label. Each view file names only its element class and its base class.
//
// HC-I2 (spec/healthcare-ui/requirements.md): the identifier is kept in text only. A value attribute is read, then removed, so a
// session-replay tool that records attributes never sees it; before connection it waits here.

import { passThroughAttributes, rootClassName } from "./dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export abstract class IdentifierView extends HTMLElement {
    /** The view's kebab-case base class, which is also its slug. */
    protected abstract readonly baseClass: string;

    #span: HTMLSpanElement | null = null;
    #text: Text | null = null;
    #pending: string | null = null;

    static get observedAttributes(): string[] {
        return ["value"];
    }

    attributeChangedCallback(name: string, _old: string | null, next: string | null): void {
        if (name !== "value" || next === null || !this.#text) return;
        this.#text.data = next;
        this.removeAttribute("value");
    }

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, this.baseClass);
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.append(hidden);
        }
        this.#text = document.createTextNode(this.#pending ?? this.getAttribute("value") ?? "");
        this.#pending = null;
        span.append(this.#text);
        passThroughAttributes(this, span, HANDLED);
        this.removeAttribute("value");

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#text?.data ?? this.#pending ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#text) this.#text.data = v;
        else this.#pending = v;
    }
}
