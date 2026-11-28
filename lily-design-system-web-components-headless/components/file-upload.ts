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

/** The files a drop carries: all of them with `multiple`, else the first. */
function droppedFiles(files: FileList, multiple: boolean): FileList {
    if (multiple || files.length <= 1 || typeof DataTransfer === "undefined") return files;
    const one = new DataTransfer();
    one.items.add(files[0]);
    return one.files;
}

// drop-zone: the element also accepts dropped files, into the same lily-change event and count, with data-drag-over while
// a file is held over it; the button stays the keyboard path.
export class FileUpload extends HTMLElement {
    #built = false;
    #input: HTMLInputElement | null = null;
    #status: HTMLSpanElement | null = null;
    #button: HTMLButtonElement | null = null;

    // A change to label, disabled, accept, multiple, drop-zone or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "disabled", "accept", "multiple", "drop-zone", "class"];
    }

    attributeChangedCallback(): void {
        const button = this.#button;
        const input = this.#input;
        if (!this.#built || !button || !input) return;
        if (!this.classList.contains("file-upload")) applySelfClassName(this, "file-upload");
        const label = this.getAttribute("label") ?? "";
        button.setAttribute("aria-label", label);
        button.textContent = label;
        button.disabled = this.hasAttribute("disabled");
        const accept = this.getAttribute("accept");
        if (accept !== null) input.accept = accept;
        else input.removeAttribute("accept");
        input.multiple = this.hasAttribute("multiple");
        if (!this.hasAttribute("drop-zone")) this.removeAttribute("data-drag-over");
    }

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
        this.#button = button;

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

        // The listeners are always there and ask drop-zone each time, so it can be turned on or off later.
        {
            this.addEventListener("dragover", (event) => {
                if (
                    !this.hasAttribute("drop-zone") ||
                    this.hasAttribute("disabled") ||
                    !event.dataTransfer?.types.includes("Files")
                )
                    return;
                event.preventDefault();
                this.setAttribute("data-drag-over", "");
            });
            this.addEventListener("dragleave", () => this.removeAttribute("data-drag-over"));
            this.addEventListener("drop", (event) => {
                if (!this.hasAttribute("drop-zone") || this.hasAttribute("disabled")) return;
                event.preventDefault();
                this.removeAttribute("data-drag-over");
                const files = event.dataTransfer?.files;
                if (!files || files.length === 0) return;
                this.#report(droppedFiles(files, this.hasAttribute("multiple")));
            });
        }
    }

    // The status for a count of files, in the consumer's words; plural forms are theirs. No English default.
    selectedLabel: ((count: number) => string) | null = null;

    #onClick = (): void => {
        this.#input?.click();
    };

    #onChange = (event: Event): void => {
        this.#report((event.target as HTMLInputElement).files);
    };

    #report(files: FileList | null): void {
        const count = files?.length ?? 0;
        this.#status!.setAttribute("data-file-count", String(count));
        this.#status!.textContent =
            count > 0 && this.selectedLabel ? this.selectedLabel(count) : "";
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { files }, bubbles: true, composed: true }),
        );
    }
}
