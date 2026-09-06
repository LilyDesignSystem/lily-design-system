// TagInput component
//
// An input for adding and removing tags. Wraps a real
// <input type="text">. Pressing Enter with a non-empty trimmed value
// fires a bubbling, composed "lily-add" CustomEvent<{ value: string }>
// and clears the input — matching the framework ports' `onadd` callback.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   disabled — presence-based boolean.
//
// Keyboard:
//   Enter — when non-empty (trimmed), fires "lily-add" and clears the input.
//
// References:
//   - components/tag-input/index.md (canonical contract)
//   - WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "disabled"]);

export class TagInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "tag-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);
        input.addEventListener("keydown", this.#onKeydown);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Enter") return;
        const input = this.#input;
        if (!input) return;
        const trimmed = input.value.trim();
        if (!trimmed) return;
        event.preventDefault();
        input.value = "";
        this.dispatchEvent(
            new CustomEvent("lily-add", { detail: { value: trimmed }, bubbles: true, composed: true }),
        );
    };
}
