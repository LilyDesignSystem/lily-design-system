// FileInput component
//
// A native <input type="file"> for selecting files from the file
// system. No visible <label> is included; consumers can add their own.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   accept — comma-separated list of accepted file types (MIME types or
//     extensions).
//   multiple — presence-based boolean; allows selecting more than one file.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (capture, event handlers, …).
//
// References:
//   - components/file-input/index.md (canonical contract)
//   - MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "accept", "multiple", "required", "disabled"]);

export class FileInput extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > input.file-input")) return;

        const input = document.createElement("input");
        input.type = "file";
        input.className = rootClassName(this, "file-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        const accept = this.getAttribute("accept");
        if (accept !== null) input.accept = accept;
        if (this.hasAttribute("multiple")) input.multiple = true;
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
    }
}
