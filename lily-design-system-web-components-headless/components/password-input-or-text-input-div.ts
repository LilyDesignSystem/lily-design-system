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
//   toggle-label — required. Accessible name and visible
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
import { setOrRemove } from "../lib/live-element.js";

export class PasswordInputOrTextInputDiv extends HTMLElement {
    #input: HTMLInputElement | null = null;
    #toggle: HTMLButtonElement | null = null;
    #visible = false;

    // A change to label, value (the default), required, disabled, show-toggle, toggle-label or class is shown (tasks.md
    // P50-T28). The toggle comes and goes with show-toggle; hiding it hides the password again.
    static get observedAttributes(): string[] {
        return ["label", "value", "required", "disabled", "show-toggle", "toggle-label", "class"];
    }

    attributeChangedCallback(): void {
        const input = this.#input;
        if (!input) return;
        if (!this.classList.contains("password-input-or-text-input-div"))
            applySelfClassName(this, "password-input-or-text-input-div");
        setOrRemove(input, "aria-label", this.getAttribute("label"));
        input.defaultValue = this.getAttribute("value") ?? "";
        input.required = this.hasAttribute("required");
        input.disabled = this.hasAttribute("disabled");
        if (this.getAttribute("show-toggle") === "false") {
            this.#toggle?.remove();
            this.#toggle = null;
            if (this.#visible) this.#onToggle();
            return;
        }
        if (!this.#toggle) this.#addToggle();
        const toggleLabel = this.getAttribute("toggle-label");
        setOrRemove(this.#toggle!, "aria-label", toggleLabel);
        this.#toggle!.textContent = toggleLabel ?? "";
    }

    #addToggle(): void {
        const toggleLabel = this.getAttribute("toggle-label");
        const toggle = document.createElement("button");
        toggle.type = "button";
        if (toggleLabel !== null) toggle.setAttribute("aria-label", toggleLabel);
        toggle.setAttribute("aria-pressed", this.#visible ? "true" : "false");
        toggle.textContent = toggleLabel ?? "";
        toggle.addEventListener("click", this.#onToggle);
        this.appendChild(toggle);
        this.#toggle = toggle;
    }

    connectedCallback(): void {
        if (this.#input) return;

        applySelfClassName(this, "password-input-or-text-input-div");

        const input = document.createElement("input");
        input.type = "password";
        input.autocomplete = "current-password";
        // Revealed as text, a password would reach an enhanced spellchecker, which can send it to a cloud service.
        input.spellcheck = false;
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.defaultValue = this.getAttribute("value") ?? "";
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        this.appendChild(input);
        this.#input = input;

        if (this.getAttribute("show-toggle") !== "false") this.#addToggle();
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
