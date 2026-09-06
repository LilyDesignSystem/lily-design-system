// Field component
//
// A form field wrapper combining a <label>, the consumer's own form
// control (light-DOM children, left exactly where they are), optional
// helper text, and an optional validation error — all linked via
// generated ids. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Visible label text.
//   description — optional helper text, shown below the label.
//   error — optional error message, shown below the field content.
//   required — presence-based boolean; adds a visually-decorative
//     (aria-hidden) asterisk and a data-required attribute.
//   input-id — optional id of the consumer's control to link the label
//     to; auto-generated if omitted. When auto-generated, and the
//     consumer's first child element carries no id of its own, that
//     generated id is also assigned to it — otherwise an
//     auto-generated `for` would not actually reference anything.
//
// References:
//   - components/field/index.md (canonical contract)
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
//   - WAI-ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class Field extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "description", "error", "required", "input-id"];
    }

    #built = false;
    #labelEl: HTMLLabelElement | null = null;
    #labelText: Text | null = null;
    #descriptionEl: HTMLParagraphElement | null = null;
    #errorEl: HTMLParagraphElement | null = null;
    #anchor: ChildNode | null = null;
    #fieldId = "";
    #descriptionId = "";
    #errorId = "";

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        this.#anchor = this.firstChild;

        const explicitId = this.getAttribute("input-id");
        this.#fieldId = explicitId || nextId("lily-field");
        this.#descriptionId = `${this.#fieldId}-description`;
        this.#errorId = `${this.#fieldId}-error`;

        if (!explicitId) {
            const firstElement = this.firstElementChild;
            if (firstElement && !firstElement.id) firstElement.id = this.#fieldId;
        }

        applySelfClassName(this, "field");

        const label = document.createElement("label");
        label.htmlFor = this.#fieldId;
        const text = document.createTextNode("");
        label.appendChild(text);
        this.#labelEl = label;
        this.#labelText = text;
        this.insertBefore(label, this.#anchor);

        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label") ?? "";
        const required = this.hasAttribute("required");
        this.#labelText!.textContent = label;

        this.toggleAttribute("data-required", required);
        this.#syncAsterisk(required);

        const description = this.getAttribute("description");
        if (description !== null) {
            if (!this.#descriptionEl) {
                const p = document.createElement("p");
                p.id = this.#descriptionId;
                this.#descriptionEl = p;
                this.insertBefore(p, this.#anchor);
            }
            this.#descriptionEl.textContent = description;
        } else if (this.#descriptionEl) {
            this.#descriptionEl.remove();
            this.#descriptionEl = null;
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
        } else if (this.#errorEl) {
            this.#errorEl.remove();
            this.#errorEl = null;
        }
    }

    #syncAsterisk(required: boolean): void {
        const label = this.#labelEl!;
        let asterisk = label.querySelector(":scope > span[aria-hidden]");
        if (required) {
            if (!asterisk) {
                asterisk = document.createElement("span");
                asterisk.setAttribute("aria-hidden", "true");
                asterisk.textContent = " *";
                label.appendChild(asterisk);
            }
        } else if (asterisk) {
            asterisk.remove();
        }
    }
}
