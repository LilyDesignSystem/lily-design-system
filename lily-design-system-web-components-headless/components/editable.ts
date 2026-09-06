// Editable component
//
// An inline-editable text element that toggles between a read-only
// display and an edit field. The canonical contract's own "HTML tag:
// <div>" is honoured as the wrapper (this catalog's autonomous custom
// elements always introduce one host node — see lib/dom-utils.ts);
// inside it, a real display <span role="button"> and a real edit
// <input type="text"> are both built once and toggled via the `hidden`
// content attribute (only one is ever visible), matching this
// catalog's EditableForm/Drawer precedent for "hidden is equivalent to
// conditional mount."
//
// Attributes:
//   label — REQUIRED. Accessible name in both display and edit modes,
//     via aria-label.
//   value — bindable current text value; also a live `value` property.
//   editing — presence-based boolean; bindable edit-mode state.
//   disabled — presence-based boolean; disables activating edit mode.
//
// Keyboard (display mode): Enter / Space activates edit mode.
// Keyboard (edit mode): Enter confirms (copies the draft to `value`);
// Escape cancels (reverts the draft, discarding the edit).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ value: string }>
// when an edit is confirmed.
//
// References:
//   - components/editable/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Editable extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "editing", "disabled"];
    }

    #built = false;
    #display: HTMLSpanElement | null = null;
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "editable");

        const display = document.createElement("span");
        display.setAttribute("role", "button");
        display.addEventListener("click", this.#onActivate);
        display.addEventListener("keydown", this.#onDisplayKeydown);
        this.#display = display;

        const input = document.createElement("input");
        input.type = "text";
        input.addEventListener("keydown", this.#onInputKeydown);
        this.#input = input;

        this.appendChild(display);
        this.appendChild(input);

        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    get value(): string {
        return this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        this.setAttribute("value", v);
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        const value = this.getAttribute("value") ?? "";
        const editing = this.hasAttribute("editing");
        const disabled = this.hasAttribute("disabled");

        const display = this.#display!;
        const input = this.#input!;

        if (label !== null) {
            display.setAttribute("aria-label", label);
            input.setAttribute("aria-label", label);
        }
        display.textContent = value;
        display.tabIndex = disabled ? -1 : 0;
        if (disabled) display.setAttribute("aria-disabled", "true");
        else display.removeAttribute("aria-disabled");

        display.hidden = editing;
        input.hidden = !editing;
        if (editing) {
            input.value = value;
        }
    }

    #startEditing(): void {
        if (this.hasAttribute("disabled")) return;
        this.setAttribute("editing", "");
        this.#input!.focus();
    }

    #confirm(): void {
        this.setAttribute("value", this.#input!.value);
        this.removeAttribute("editing");
        this.dispatchEvent(
            new CustomEvent("lily-change", {
                detail: { value: this.#input!.value },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #cancel(): void {
        this.removeAttribute("editing");
    }

    #onActivate = (): void => {
        this.#startEditing();
    };

    #onDisplayKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.#startEditing();
        }
    };

    #onInputKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.#confirm();
        } else if (event.key === "Escape") {
            event.preventDefault();
            this.#cancel();
        }
    };
}
