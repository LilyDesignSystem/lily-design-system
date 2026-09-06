// SliderButton component
//
// A native <button role="slider"> that the user slides (or, via keyboard,
// nudges with arrow keys) to confirm an action. Renders a real <button>
// element (pattern 1); the consumer's light-DOM children become the
// button's visible label content.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the confirmation action,
//     via aria-label.
//   disabled — presence-based boolean.
//
// Keyboard: ArrowRight/ArrowLeft nudge the slider position by 10; Enter
// activates immediately (accessibility fallback). Reaching 100 (by either
// path, or a native click) fires a bubbling, composed "lily-confirm"
// CustomEvent.
//
// References:
//   - components/slider-button/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "disabled"]);

export class SliderButton extends HTMLElement {
    #button: HTMLButtonElement | null = null;
    #value = 0;

    connectedCallback(): void {
        if (this.#button) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "slider-button");
        button.setAttribute("role", "slider");
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        button.setAttribute("aria-valuemin", "0");
        button.setAttribute("aria-valuemax", "100");
        button.setAttribute("aria-valuenow", String(this.#value));
        if (this.hasAttribute("disabled")) button.disabled = true;
        passThroughAttributes(this, button, HANDLED);
        button.addEventListener("keydown", this.#onKeydown);
        button.addEventListener("click", this.#onClick);

        moveChildrenInto(this, button);
        this.appendChild(button);
        this.#button = button;
    }

    get value(): number {
        return this.#value;
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            this.#setValue(Math.min(100, this.#value + 10));
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.#setValue(Math.max(0, this.#value - 10));
        } else if (event.key === "Enter") {
            event.preventDefault();
            this.#confirm();
            return;
        } else {
            return;
        }
        if (this.#value >= 100) this.#confirm();
    };

    #onClick = (): void => {
        this.#confirm();
    };

    #setValue(v: number): void {
        this.#value = v;
        this.#button?.setAttribute("aria-valuenow", String(v));
    }

    #confirm(): void {
        this.#setValue(100);
        this.dispatchEvent(new CustomEvent("lily-confirm", { bubbles: true, composed: true }));
    }
}
