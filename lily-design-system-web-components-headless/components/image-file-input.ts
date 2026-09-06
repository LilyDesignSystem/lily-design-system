// ImageFileInput component
//
// A native <input type="file"> pre-configured to accept images.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   accept — default "image/*"; narrow to specific MIME types (e.g.
//     "image/png, image/jpeg").
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input>.
//
// References:
//   - components/image-file-input/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "accept", "required", "disabled"]);

export class ImageFileInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "file";
        input.className = rootClassName(this, "image-file-input");
        input.accept = this.getAttribute("accept") ?? "image/*";
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }
}
