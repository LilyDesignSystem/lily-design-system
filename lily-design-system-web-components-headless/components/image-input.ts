// ImageInput component
//
// A native <input type="image"> — a graphical form-submit button. Unlike
// most inputs in this catalog, its accessible name comes from `alt`
// (the native semantics for this input type), not `aria-label`.
//
// Attributes:
//   src — REQUIRED. Image URL to display.
//   alt — REQUIRED. Alternative text; also the accessible name.
//   width, height — optional; image dimensions in pixels.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <input>.
//
// References:
//   - components/image-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "alt", "width", "height", "disabled"]);

export class ImageInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "image";
        input.className = rootClassName(this, "image-input");
        const src = this.getAttribute("src");
        if (src !== null) input.src = src;
        const alt = this.getAttribute("alt");
        if (alt !== null) input.alt = alt;
        const width = this.getAttribute("width");
        if (width !== null) input.width = Number(width);
        const height = this.getAttribute("height");
        if (height !== null) input.height = Number(height);
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }
}
