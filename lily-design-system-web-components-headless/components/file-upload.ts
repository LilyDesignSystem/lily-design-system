// FileUpload component
//
// A button-triggered file picker: a visible <button>, a hidden
// <input type="file">, and a live status region announcing the
// selected file count. The custom element stands in for the wrapper
// div directly (see lib/dom-utils.applySelfClassName), and builds all
// three as its own children.
//
// Attributes:
//   label — REQUIRED. Accessible name for the button; also its visible
//     text.
//   accept — optional accepted file types (e.g. ".pdf", "image/*").
//   multiple — presence-based boolean.
//   disabled — presence-based boolean.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ files: FileList
// | null }> when files are selected — the imperative equivalent of the
// canonical contract's `onchange` callback prop.
//
// References:
//   - components/file-upload/index.md (canonical contract)
//   - MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

import { applySelfClassName } from "../lib/dom-utils.js";

export class FileUpload extends HTMLElement {
    #built = false;
    #input: HTMLInputElement | null = null;
    #status: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "file-upload");

        const label = this.getAttribute("label") ?? "";
        const disabled = this.hasAttribute("disabled");

        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", label);
        button.textContent = label;
        button.disabled = disabled;
        button.addEventListener("click", this.#onClick);

        const input = document.createElement("input");
        input.type = "file";
        const accept = this.getAttribute("accept");
        if (accept !== null) input.accept = accept;
        input.multiple = this.hasAttribute("multiple");
        input.hidden = true;
        input.addEventListener("change", this.#onChange);
        this.#input = input;

        const status = document.createElement("span");
        status.setAttribute("aria-live", "polite");
        status.setAttribute("data-file-count", "0");
        this.#status = status;

        this.appendChild(button);
        this.appendChild(input);
        this.appendChild(status);
    }

    #onClick = (): void => {
        this.#input?.click();
    };

    #onChange = (event: Event): void => {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        const count = files?.length ?? 0;
        this.#status!.setAttribute("data-file-count", String(count));
        this.#status!.textContent = count > 0 ? `${count} ${count === 1 ? "file" : "files"} selected` : "";
        this.dispatchEvent(new CustomEvent("lily-change", { detail: { files }, bubbles: true, composed: true }));
    };
}
