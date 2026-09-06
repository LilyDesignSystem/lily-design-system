// MentionsInput component
//
// A text input with at-mention autocomplete suggestions. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName): it builds an inner
// <input class="mentions-input-control" role="combobox"> once, plus a
// <div class="mentions-input-suggestions"> that the consumer's light-DOM
// children (typically a Listbox) are moved into. The `expanded` attribute
// is the single source of truth for open/closed — the canonical contract
// (matching every other framework's port) leaves *deciding when* to open
// the panel (typing the trigger character, filtering matches) to the
// consumer; this component only keeps the DOM in sync with that decision.
//
// Attributes:
//   label — REQUIRED. Accessible name for the input, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   trigger-char — default "@". Exposed as data-trigger-char on the host.
//   expanded — presence-based boolean; bindable. Toggles aria-expanded on
//     the input and the hidden attribute on the suggestions panel.
//   placeholder — optional, applied to the input.
//   disabled — presence-based boolean, applied to the input.
//
// References:
//   - components/mentions-input/index.md (canonical contract)
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
//   - Ant Design Mentions: https://ant.design/components/mentions

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class MentionsInput extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "trigger-char", "expanded", "placeholder", "disabled"];
    }

    #input: HTMLInputElement | null = null;
    #suggestions: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        applySelfClassName(this, "mentions-input");

        const input = document.createElement("input");
        input.type = "text";
        input.className = "mentions-input-control";
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-haspopup", "listbox");
        input.setAttribute("aria-autocomplete", "list");

        const suggestions = document.createElement("div");
        suggestions.className = "mentions-input-suggestions";
        moveChildrenInto(this, suggestions);

        this.appendChild(input);
        this.appendChild(suggestions);
        this.#input = input;
        this.#suggestions = suggestions;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }

    #sync(): void {
        const input = this.#input;
        const suggestions = this.#suggestions;
        if (!input || !suggestions) return;

        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);

        const value = this.getAttribute("value");
        if (value !== null && input.value !== value) input.value = value;

        const triggerChar = this.getAttribute("trigger-char") ?? "@";
        this.setAttribute("data-trigger-char", triggerChar);

        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) input.setAttribute("placeholder", placeholder);
        else input.removeAttribute("placeholder");

        input.disabled = this.hasAttribute("disabled");

        const expanded = this.hasAttribute("expanded");
        input.setAttribute("aria-expanded", expanded ? "true" : "false");
        suggestions.hidden = !expanded;
    }
}
