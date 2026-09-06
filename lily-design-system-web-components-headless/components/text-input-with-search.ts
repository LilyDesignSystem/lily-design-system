// TextInputWithSearch component
//
// A single-line text input field with search capability. Renders a
// <div role="search">; the custom element stands in for that div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element. Builds a real
// <input type="text"> and a <button type="button"> as children.
//
// Attributes:
//   label — REQUIRED. Accessible name for the search region, via
//     aria-label.
//   input-label — default "Search". Accessible name for the text input.
//   search-label — default "Search". Accessible label and visible text
//     for the search button.
//   value — initial value; also exposed as a live `value` property.
//   placeholder — optional.
//   required, disabled — presence-based booleans.
//
// Pressing Enter in the input, or activating the button, fires a
// bubbling, composed "lily-search" CustomEvent<{ value: string }> —
// matching the framework ports' `onsearch` callback.
//
// References:
//   - components/text-input-with-search/index.md (canonical contract)
//   - WAI-ARIA search role: https://www.w3.org/TR/wai-aria-1.2/#search

import { applySelfClassName } from "../lib/dom-utils.js";

export class TextInputWithSearch extends HTMLElement {
    #built = false;
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "text-input-with-search");
        this.setAttribute("role", "search");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const input = document.createElement("input");
        input.type = "text";
        const inputLabel = this.getAttribute("input-label") ?? "Search";
        input.setAttribute("aria-label", inputLabel);
        input.value = this.getAttribute("value") ?? "";
        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) input.placeholder = placeholder;
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        input.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            this.#search();
        });

        const searchLabel = this.getAttribute("search-label") ?? "Search";
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", searchLabel);
        button.textContent = searchLabel;
        if (this.hasAttribute("disabled")) button.disabled = true;
        button.addEventListener("click", () => this.#search());

        this.appendChild(input);
        this.appendChild(button);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }

    #search(): void {
        const value = this.value;
        this.dispatchEvent(new CustomEvent("lily-search", { detail: { value }, bubbles: true, composed: true }));
    }
}
