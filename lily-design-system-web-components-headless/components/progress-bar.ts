// ProgressBar component
//
// A <div role="progressbar"> composition for cases where the native
// <progress> element does not provide enough styling control (compare
// with Progress). The custom element stands in for the div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — REQUIRED. Current value.
//   min — default 0.
//   max — default 100.
//
// References:
//   - components/progress-bar/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class ProgressBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "progress-bar");
        this.setAttribute("role", "progressbar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("aria-valuenow", this.getAttribute("value") ?? "0");
        this.setAttribute("aria-valuemin", this.getAttribute("min") ?? "0");
        this.setAttribute("aria-valuemax", this.getAttribute("max") ?? "100");
    }
}
