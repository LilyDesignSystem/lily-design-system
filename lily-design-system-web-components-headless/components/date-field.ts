// DateField component
//
// A fully labeled date field: a <label>, a native <input type="date">,
// optional helper text, and an optional validation error — all linked
// via generated ids. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName), and builds the
// label/input/description/error as its own children.
//
// Attributes:
//   label — REQUIRED. Visible label text.
//   value — bindable date value (YYYY-MM-DD); also a live `value`
//     property.
//   description — optional helper text.
//   error — optional validation error message.
//   required, disabled — presence-based booleans.
//   id — optional custom id for the input; auto-generated if omitted.
//     (Read once, then removed from the host — the id belongs to the
//     inner <input>, not to the host, since giving both the same id
//     would be an invalid duplicate.)
//
// References:
//   - components/date-field/index.md (canonical contract)
//   - ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class DateField extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "description", "error", "required", "disabled"];
    }

    #built = false;
    #labelEl: HTMLLabelElement | null = null;
    #input: HTMLInputElement | null = null;
    #descriptionEl: HTMLParagraphElement | null = null;
    #errorEl: HTMLParagraphElement | null = null;
    #inputId = "";
    #descriptionId = "";
    #errorId = "";

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        const explicitId = this.getAttribute("id");
        if (explicitId) this.removeAttribute("id");
        this.#inputId = explicitId || nextId("lily-date-field");
        this.#descriptionId = `${this.#inputId}-description`;
        this.#errorId = `${this.#inputId}-error`;

        applySelfClassName(this, "date-field");

        const label = document.createElement("label");
        label.htmlFor = this.#inputId;
        this.#labelEl = label;

        const input = document.createElement("input");
        input.type = "date";
        input.id = this.#inputId;
        input.addEventListener("input", this.#onInput);
        this.#input = input;

        this.appendChild(label);
        this.appendChild(input);

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
        this.setAttribute("value", v);
    }

    #sync(): void {
        if (!this.#built) return;
        const input = this.#input!;

        this.#labelEl!.textContent = this.getAttribute("label") ?? "";

        const value = this.getAttribute("value");
        if (value !== null && input.value !== value) input.value = value;

        input.required = this.hasAttribute("required");
        input.disabled = this.hasAttribute("disabled");

        const description = this.getAttribute("description");
        if (description !== null) {
            if (!this.#descriptionEl) {
                const p = document.createElement("p");
                p.id = this.#descriptionId;
                this.#descriptionEl = p;
                this.insertBefore(p, this.#errorEl);
            }
            this.#descriptionEl.textContent = description;
            input.setAttribute("aria-describedby", this.#descriptionId);
        } else if (this.#descriptionEl) {
            this.#descriptionEl.remove();
            this.#descriptionEl = null;
            input.removeAttribute("aria-describedby");
        }

        const error = this.getAttribute("error");
        if (error !== null) {
            if (!this.#errorEl) {
                const p = document.createElement("p");
                p.id = this.#errorId;
                p.setAttribute("role", "alert");
                this.#errorEl = p;
                this.appendChild(p);
            }
            this.#errorEl.textContent = error;
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-errormessage", this.#errorId);
        } else if (this.#errorEl) {
            this.#errorEl.remove();
            this.#errorEl = null;
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-errormessage");
        }
    }

    #onInput = (): void => {
        this.setAttribute("value", this.#input!.value);
    };
}
