// Dial component
//
// A rotary dial control for selecting a numeric value within a range.
// No native dial element exists, so this renders a <div role="slider">;
// the custom element stands in for that div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. The consumer draws the actual
// dial visualization; this component owns only the ARIA slider
// semantics, keyboard behaviour, and the live value state.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value, default 0. Also a live `value` property.
//   min — default 0.
//   max — default 100.
//   step — default 1. Increment per key press (Shift multiplies by 10).
//   disabled — presence-based boolean; sets tabindex="-1" and
//     aria-disabled="true" (omitted, not "false", when not disabled).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ value: number }>
// whenever the value changes by keyboard interaction.
//
// Keyboard:
//   ArrowRight/ArrowUp — increase value by one step (Shift: 10 steps)
//   ArrowLeft/ArrowDown — decrease value by one step (Shift: 10 steps)
//   Home — set value to min
//   End — set value to max
//
// References:
//   - components/dial/index.md (canonical contract)
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
//   - WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider

import { applySelfClassName } from "../lib/dom-utils.js";

export class Dial extends HTMLElement {
    #built = false;
    #value = 0;
    #min = 0;
    #max = 100;
    #step = 1;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "dial");
        this.setAttribute("role", "slider");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        this.#min = Number(this.getAttribute("min") ?? "0") || 0;
        this.#max = Number(this.getAttribute("max") ?? "100") || 100;
        this.#step = Number(this.getAttribute("step") ?? "1") || 1;
        this.#value = this.#clamp(Number(this.getAttribute("value") ?? "0") || 0);

        this.addEventListener("keydown", this.#onKeydown);
        this.#sync();
    }

    get value(): number {
        return this.#value;
    }

    set value(v: number) {
        this.#value = this.#clamp(v);
        this.#sync();
    }

    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    set disabled(v: boolean) {
        this.toggleAttribute("disabled", v);
        this.#sync();
    }

    #clamp(v: number): number {
        return Math.min(this.#max, Math.max(this.#min, v));
    }

    #sync(): void {
        if (!this.#built) return;
        this.setAttribute("aria-valuenow", String(this.#value));
        this.setAttribute("aria-valuemin", String(this.#min));
        this.setAttribute("aria-valuemax", String(this.#max));
        const disabled = this.hasAttribute("disabled");
        this.tabIndex = disabled ? -1 : 0;
        if (disabled) this.setAttribute("aria-disabled", "true");
        else this.removeAttribute("aria-disabled");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (this.hasAttribute("disabled")) return;
        const amount = this.#step * (event.shiftKey ? 10 : 1);
        let changed = true;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                this.#value = this.#clamp(this.#value + amount);
                break;
            case "ArrowLeft":
            case "ArrowDown":
                this.#value = this.#clamp(this.#value - amount);
                break;
            case "Home":
                this.#value = this.#min;
                break;
            case "End":
                this.#value = this.#max;
                break;
            default:
                changed = false;
        }
        if (!changed) return;
        event.preventDefault();
        this.#sync();
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { value: this.#value }, bubbles: true, composed: true }),
        );
    };
}
