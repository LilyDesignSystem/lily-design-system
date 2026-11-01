// ScrollBar component
//
// A focusable <div role="scrollbar"> track element for a custom scrollbar
// control. No native element behaviour is worth deferring to for a plain
// <div>, so the custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName). The component owns the ARIA scrollbar
// semantics, the keyboard and the live value; the consumer provides the
// draggable thumb as light-DOM children, scrolls its content on
// "lily-change", sets `value` back as the content scrolls, and handles drag.
//
// Attributes:
//   label — REQUIRED. Accessible name via aria-label.
//   orientation — "vertical" | "horizontal", default "vertical".
//   value — initial value, default 0. Also a live `value` property.
//   min — default 0.
//   max — default 100.
//   step — default 1. Arrow-key increment.
//   page-step — default 10. Page Up / Page Down increment.
//   controls — the id of the scrolled element, via aria-controls.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ value: number }>
// whenever a key changes the value.
//
// Keyboard:
//   ArrowUp/ArrowLeft — decrease value by step
//   ArrowDown/ArrowRight — increase value by step
//   PageUp/PageDown — decrease/increase value by page-step
//   Home — set value to min
//   End — set value to max
//
// References:
//   - components/scroll-bar/index.md (canonical contract)
//   - WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

import { applySelfClassName } from "../lib/dom-utils.js";

export class ScrollBar extends HTMLElement {
    #built = false;
    #value = 0;
    #min = 0;
    #max = 100;
    #step = 1;
    #pageStep = 10;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "scroll-bar");
        this.setAttribute("role", "scrollbar");
        this.tabIndex = 0;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        const orientation = this.getAttribute("orientation") ?? "vertical";
        this.setAttribute("aria-orientation", orientation);
        const controls = this.getAttribute("controls");
        if (controls) this.setAttribute("aria-controls", controls);

        this.#min = this.#number("min", 0);
        this.#max = this.#number("max", 100);
        this.#step = this.#number("step", 1);
        this.#pageStep = this.#number("page-step", 10);
        this.#value = this.#clamp(this.#number("value", 0));

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

    #number(name: string, fallback: number): number {
        const n = parseFloat(this.getAttribute(name) ?? "");
        return Number.isNaN(n) ? fallback : n;
    }

    #clamp(v: number): number {
        return Math.min(this.#max, Math.max(this.#min, v));
    }

    #sync(): void {
        if (!this.#built) return;
        this.setAttribute("aria-valuenow", String(this.#value));
        this.setAttribute("aria-valuemin", String(this.#min));
        this.setAttribute("aria-valuemax", String(this.#max));
    }

    #onKeydown = (event: KeyboardEvent): void => {
        let next: number;
        switch (event.key) {
            case "ArrowUp":
            case "ArrowLeft":
                next = this.#value - this.#step;
                break;
            case "ArrowDown":
            case "ArrowRight":
                next = this.#value + this.#step;
                break;
            case "PageUp":
                next = this.#value - this.#pageStep;
                break;
            case "PageDown":
                next = this.#value + this.#pageStep;
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
        this.#value = this.#clamp(next);
        this.#sync();
        this.dispatchEvent(
            new CustomEvent("lily-change", {
                detail: { value: this.#value },
                bubbles: true,
                composed: true,
            }),
        );
    };
}
