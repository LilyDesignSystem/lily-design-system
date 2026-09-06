// SearchInput component
//
// A native <input type="search"> for entering a search query, with
// role="searchbox" per the canonical contract (documented explicitly,
// unlike TextInput/EmailInput/TelInput which rely on the implicit role).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input>.
//
// Keyboard: Escape clears the field, Enter submits the containing form —
// both native <input type="search"> behaviour.
//
// References:
//   - components/search-input/index.md (canonical contract)
//   - WAI-ARIA Search Role: https://www.w3.org/WAI/ARIA/apg/patterns/search/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled"]);

export class SearchInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "search";
        input.setAttribute("role", "searchbox");
        input.className = rootClassName(this, "search-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

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
}
