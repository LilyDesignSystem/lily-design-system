// ColorPicker component
//
// A headless two-dimensional area for picking a colour by saturation (X,
// 0-100) and brightness (Y, 0-100). Renders as a <div role="slider">;
// the custom element stands in for that div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. The consumer draws the actual
// colour board and cursor from `data-x` / `data-y`; this component owns
// only the ARIA slider semantics, keyboard behaviour, and the live x/y
// state.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   x — initial horizontal position (0-100, saturation), default 0.
//     Also exposed as a live `x` property.
//   y — initial vertical position (0-100, brightness), default 0. Also
//     exposed as a live `y` property.
//   disabled — presence-based boolean; sets tabindex="-1" and
//     aria-disabled="true" (omitted, not "false", when not disabled).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ x: number, y:
// number }> whenever x or y changes by keyboard interaction.
//
// Keyboard:
//   ArrowRight/ArrowLeft — increase/decrease X by 1 (Shift: by 10)
//   ArrowUp/ArrowDown — decrease/increase Y by 1 (Shift: by 10)
//   Home — set X to 0
//   End — set X to 100
//
// References:
//   - components/color-picker/index.md (canonical contract)
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import { applySelfClassName } from "../lib/dom-utils.js";

function clamp(value: number): number {
    return Math.min(100, Math.max(0, value));
}

export class ColorPicker extends HTMLElement {
    #built = false;
    #x = 0;
    #y = 0;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "color-picker");
        this.setAttribute("role", "slider");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("aria-valuemin", "0");
        this.setAttribute("aria-valuemax", "100");

        this.#x = clamp(Number(this.getAttribute("x") ?? "0") || 0);
        this.#y = clamp(Number(this.getAttribute("y") ?? "0") || 0);

        this.addEventListener("keydown", this.#onKeydown);
        this.#sync();
    }

    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = clamp(value);
        this.#sync();
    }

    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = clamp(value);
        this.#sync();
    }

    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    set disabled(value: boolean) {
        this.toggleAttribute("disabled", value);
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        this.setAttribute("aria-valuenow", String(this.#x));
        this.setAttribute("data-x", String(this.#x));
        this.setAttribute("data-y", String(this.#y));
        const disabled = this.hasAttribute("disabled");
        this.tabIndex = disabled ? -1 : 0;
        if (disabled) this.setAttribute("aria-disabled", "true");
        else this.removeAttribute("aria-disabled");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (this.hasAttribute("disabled")) return;
        const step = event.shiftKey ? 10 : 1;
        let changed = true;
        switch (event.key) {
            case "ArrowRight":
                this.#x = clamp(this.#x + step);
                break;
            case "ArrowLeft":
                this.#x = clamp(this.#x - step);
                break;
            case "ArrowUp":
                this.#y = clamp(this.#y - step);
                break;
            case "ArrowDown":
                this.#y = clamp(this.#y + step);
                break;
            case "Home":
                this.#x = 0;
                break;
            case "End":
                this.#x = 100;
                break;
            default:
                changed = false;
        }
        if (!changed) return;
        event.preventDefault();
        this.#sync();
        this.dispatchEvent(
            new CustomEvent("lily-change", {
                detail: { x: this.#x, y: this.#y },
                bubbles: true,
                composed: true,
            }),
        );
    };
}
