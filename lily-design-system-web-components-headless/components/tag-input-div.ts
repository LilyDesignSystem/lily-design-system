// TagInputDiv component
//
// A group holding the consumer's tags and a text field that adds to them.
// Pressing Enter with a non-empty trimmed value fires a bubbling, composed
// "lily-add" CustomEvent<{ value: string }> and clears the field, matching the
// framework ports' `onadd` callback. The tags are the consumer's: it keeps the
// collection and renders it as children, with its own remove buttons.
//
// Attributes:
//   label — REQUIRED. Accessible name of the group and the field, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   disabled, required — presence-based booleans, on the field.
//   placeholder, name — on the field.
//
// Keyboard:
//   Enter — when non-empty (trimmed), fires "lily-add" and clears the field. With
//   no text it stays a normal Enter, which submits a surrounding form. During an
//   IME composition it confirms the composition, so it adds nothing.
//
// References:
//   - components/tag-input-div/index.md (canonical contract)
//   - WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "disabled", "required", "placeholder", "name"]);

export class TagInputDiv extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const root = document.createElement("div");
        root.className = rootClassName(this, "tag-input-div");
        root.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) root.setAttribute("aria-label", label);
        passThroughAttributes(this, root, HANDLED);

        const input = document.createElement("input");
        input.type = "text";
        input.className = "tag-input-div-field";
        if (label !== null) input.setAttribute("aria-label", label);
        input.defaultValue = this.getAttribute("value") ?? "";
        input.disabled = this.hasAttribute("disabled");
        input.required = this.hasAttribute("required");
        for (const name of ["placeholder", "name"]) {
            const value = this.getAttribute(name);
            if (value !== null) input.setAttribute(name, value);
        }
        input.addEventListener("keydown", this.#onKeydown);

        moveChildrenInto(this, root);
        root.appendChild(input);
        this.appendChild(root);
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
        if (event.key !== "Enter" || event.isComposing) return;
        const input = this.#input;
        if (!input) return;
        const trimmed = input.value.trim();
        if (!trimmed) return;
        event.preventDefault();
        input.value = "";
        this.dispatchEvent(
            new CustomEvent("lily-add", {
                detail: { value: trimmed },
                bubbles: true,
                composed: true,
            }),
        );
    };
}
