// InputWithMask component
//
// A <div> wrapper around a decorative format-mask display and a real
// text <input>. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the input, via aria-label.
//   mask — REQUIRED. Format mask string (e.g. "(___) ___-____"),
//     rendered both as data-mask on the wrapper and as the decorative
//     mask-display span's text content.
//   value — initial input value; also a live `value` property that
//     proxies to the inner <input>.
//   placeholder, disabled — forwarded to the inner <input>.
//
// The mask display is purely decorative (aria-hidden); the input's
// aria-label is the accessible name. The native `input` event bubbles
// through the light DOM, so consumers may listen on this element itself
// or on the inner `.input-with-mask-control` directly.
//
// References:
//   - components/input-with-mask/index.md (canonical contract)
//   - US Web Design System Input Mask: https://designsystem.digital.gov/components/input-mask/
//   - WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden

import { applySelfClassName } from "../lib/dom-utils.js";

export class InputWithMask extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        applySelfClassName(this, "input-with-mask");
        const mask = this.getAttribute("mask") ?? "";
        this.setAttribute("data-mask", mask);

        const display = document.createElement("span");
        display.className = "input-with-mask-display";
        display.setAttribute("aria-hidden", "true");
        display.textContent = mask;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "input-with-mask-control";
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) input.placeholder = placeholder;
        if (this.hasAttribute("disabled")) input.disabled = true;

        this.appendChild(display);
        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
