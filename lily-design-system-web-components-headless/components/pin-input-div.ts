// PinInputDiv component
//
// A segmented PIN/OTP entry: a <div role="group"> containing one
// single-character <input> per digit. The custom element stands in for
// the wrapper div directly (see lib/dom-utils.applySelfClassName); the
// digit inputs are built once at connect time — `length` is captured at
// connect and is not reactive, matching the canonical contract ("the pin
// length is expected to be static").
//
// Attributes:
//   label — REQUIRED. Accessible label for the group, via aria-label.
//   length — default 4. Number of digit inputs.
//   value — initial combined string of digits; also exposed as a live
//     `value` property.
//   disabled — presence-based boolean, applied to every digit input.
//
// Properties:
//   digitLabel — (position, length) => string, optional. Each digit
//     input's accessible name, e.g. (n, of) => `Digit ${n} of ${of}`.
//     Without it each input is named by `label`: no English default.
//     Property-only (a function cannot be an attribute); setting it after
//     connect relabels the existing inputs.
//
// Keyboard:
//   Digit entry — accepts 0-9 only, auto-focuses the next input.
//   Backspace — clears the current digit, or (when already empty) clears
//     and focuses the previous digit.
//   ArrowLeft / ArrowRight — move focus between digits.
//
// References:
//   - components/pin-input-div/index.md (canonical contract)
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

import { applySelfClassName } from "../lib/dom-utils.js";

export class PinInputDiv extends HTMLElement {
    #inputs: HTMLInputElement[] = [];
    #digitLabel: ((position: number, length: number) => string) | undefined;

    get digitLabel(): ((position: number, length: number) => string) | undefined {
        return this.#digitLabel;
    }
    set digitLabel(fn: ((position: number, length: number) => string) | undefined) {
        this.#digitLabel = fn;
        this.#inputs.forEach((input, index) => input.setAttribute("aria-label", this.#inputLabel(index)));
    }

    #inputLabel(index: number): string {
        const length = this.#inputs.length || Number(this.getAttribute("length") ?? "4") || 4;
        return this.#digitLabel ? this.#digitLabel(index + 1, length) : (this.getAttribute("label") ?? "");
    }

    connectedCallback(): void {
        if (this.#inputs.length > 0) return;

        applySelfClassName(this, "pin-input-div");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const length = Math.max(1, Number(this.getAttribute("length") ?? "4") || 4);
        const initial = this.getAttribute("value") ?? "";
        const disabled = this.hasAttribute("disabled");

        for (let index = 0; index < length; index += 1) {
            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric";
            input.maxLength = 1;
            input.setAttribute(
                "aria-label",
                this.#digitLabel ? this.#digitLabel(index + 1, length) : (label ?? ""),
            );
            // `defaultValue`, not `value`: a form reset restores an input to its
            // default, so the initial digits — not empty fields — come back.
            input.defaultValue = initial[index] ?? "";
            input.disabled = disabled;
            input.addEventListener("input", (event) => this.#onInput(index, event));
            input.addEventListener("keydown", (event) => this.#onKeydown(index, event));
            this.appendChild(input);
            this.#inputs.push(input);
        }
    }

    get value(): string {
        return this.#inputs.map((input) => input.value).join("");
    }

    set value(v: string) {
        this.#inputs.forEach((input, index) => {
            input.value = v[index] ?? "";
        });
    }

    #onInput(index: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const inputValue = input.value;

        if (inputValue && !/^[0-9]$/.test(inputValue)) {
            input.value = "";
            return;
        }

        if (inputValue && index < this.#inputs.length - 1) {
            this.#inputs[index + 1]?.focus();
        }
    }

    #onKeydown(index: number, event: KeyboardEvent): void {
        const input = event.target as HTMLInputElement;

        if (event.key === "Backspace") {
            if (!input.value && index > 0) {
                const previous = this.#inputs[index - 1];
                previous?.focus();
                if (previous) previous.value = "";
            } else {
                input.value = "";
            }
        } else if (event.key === "ArrowLeft" && index > 0) {
            this.#inputs[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < this.#inputs.length - 1) {
            this.#inputs[index + 1]?.focus();
        }
    }
}
