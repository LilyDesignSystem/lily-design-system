// Slider component
//
// A real WAI-ARIA slider widget: a focusable <div role="slider"> with
// aria-valuenow/min/max and arrow-key value adjustment. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// DELIBERATE DEVIATION FROM ITS OWN AGENTS.md AND THE CANONICAL
// svelte-headless SOURCE, PER EXPLICIT TASK INSTRUCTION (not an
// oversight): both describe Slider as a bare native
// `<input type="range">` — which is exactly what this catalog's own
// range-input.ts already is. Implementing Slider identically would
// make it a pointless restatement of RangeInput under a different tag
// name. This implementation instead builds the real APG slider pattern
// the component's own name and category promise, on the canonical
// `<div>` root its AGENTS.md's Metadata table specifies.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — default 50.
//   min — default 0.
//   max — default 100.
//   step — default 1.
//   disabled — presence-based boolean.
//
// Keyboard: ArrowRight/ArrowUp increase by one step; ArrowLeft/ArrowDown
// decrease by one step; Home jumps to min; End jumps to max. Fires a
// bubbling, composed "lily-change" CustomEvent<{ value: number }>
// whenever the value changes by keyboard interaction.
//
// References:
//   - components/slider/index.md (canonical contract)
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Slider extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["value", "min", "max", "step", "label", "disabled"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "slider");
            this.setAttribute("role", "slider");
            this.addEventListener("keydown", this.#onKeydown);
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    get #min(): number {
        const raw = this.getAttribute("min");
        return raw !== null ? Number(raw) : 0;
    }

    get #max(): number {
        const raw = this.getAttribute("max");
        return raw !== null ? Number(raw) : 100;
    }

    get #step(): number {
        const raw = this.getAttribute("step");
        return raw !== null ? Number(raw) : 1;
    }

    get value(): number {
        const raw = this.getAttribute("value");
        return raw !== null ? Number(raw) : 50;
    }

    set value(v: number) {
        const clamped = Math.min(this.#max, Math.max(this.#min, v));
        this.setAttribute("value", String(clamped));
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("aria-valuemin", String(this.#min));
        this.setAttribute("aria-valuemax", String(this.#max));
        this.setAttribute("aria-valuenow", String(this.value));
        if (this.hasAttribute("disabled")) {
            this.tabIndex = -1;
            this.setAttribute("aria-disabled", "true");
        } else {
            this.tabIndex = 0;
            this.removeAttribute("aria-disabled");
        }
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (this.hasAttribute("disabled")) return;
        let next: number;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                next = this.value + this.#step;
                break;
            case "ArrowLeft":
            case "ArrowDown":
                next = this.value - this.#step;
                break;
            case "Home":
                next = this.#min;
                break;
            case "End":
                next = this.#max;
                break;
            default:
                return;
        }
        event.preventDefault();
        this.value = next;
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { value: this.value }, bubbles: true, composed: true }),
        );
    };
}
