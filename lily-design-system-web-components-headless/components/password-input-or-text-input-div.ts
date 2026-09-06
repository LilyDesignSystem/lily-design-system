// PasswordInputOrTextInputDiv component
//
// A wrapper <div> around a native password/text input with an optional
// show/hide toggle button. The custom element stands in for the wrapper
// div directly (see lib/dom-utils.applySelfClassName); the input and
// toggle button are built once at connect time.
//
// Attributes:
//   label — REQUIRED. Accessible name for the input, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   show-toggle — "true" | "false", default true (absent = true). When
//     "false", the toggle button is not rendered.
//   toggle-label — default "Show password". Accessible name and visible
//     text for the toggle button.
//   required, disabled — presence-based booleans, applied to the input.
//
// Keyboard: Enter/Space on the toggle button toggles visibility (native
// <button> behaviour).
//
// References:
//   - components/password-input-or-text-input-div/index.md (canonical contract)
//   - HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
//   - WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { applySelfClassName } from "../lib/dom-utils.js";

export class PasswordInputOrTextInputDiv extends HTMLElement {
    #input: HTMLInputElement | null = null;
    #toggle: HTMLButtonElement | null = null;
    #visible = false;

    connectedCallback(): void {
        if (this.#input) return;

        applySelfClassName(this, "password-input-or-text-input-div");

        const input = document.createElement("input");
        input.type = "password";
        input.autocomplete = "current-password";
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        this.appendChild(input);
        this.#input = input;

        const showToggle = this.getAttribute("show-toggle") !== "false";
        if (showToggle) {
            const toggleLabel = this.getAttribute("toggle-label") ?? "Show password";
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.setAttribute("aria-label", toggleLabel);
            toggle.setAttribute("aria-pressed", "false");
            toggle.textContent = toggleLabel;
            toggle.addEventListener("click", this.#onToggle);
            this.appendChild(toggle);
            this.#toggle = toggle;
        }
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }

    #onToggle = (): void => {
        this.#visible = !this.#visible;
        if (this.#input) this.#input.type = this.#visible ? "text" : "password";
        this.#toggle?.setAttribute("aria-pressed", this.#visible ? "true" : "false");
    };
}
