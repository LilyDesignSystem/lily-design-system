// DownloadButton component
//
// A download link styled as a button, with optional file size and format
// metadata. Uses <a> (not <button>) so right-click "Save link as" works and
// the native `download` attribute applies.
//
// Attributes:
//   href — REQUIRED. File URL.
//   label — REQUIRED. Sets aria-label so the accessible name reflects
//     download intent, and is the default visible text when no children
//     are provided.
//   file-size — optional pre-formatted size text (e.g. "2.4 MB"); surfaced
//     as data-file-size for consumer styling.
//   file-format — optional file format text (e.g. "PDF"); surfaced as
//     data-file-format for consumer styling.
//   download — optional. Omitted or "true"/"" renders a bare `download`
//     attribute (default). "false" omits the attribute entirely. Any other
//     string sets the suggested filename.
//   ...rest — spread onto the <a>.
//
// Children:
//   Optional visible content; defaults to the label when omitted.
//
// References:
//   - components/download-button/index.md (canonical contract)
//   - MDN <a> download attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["href", "label", "file-size", "file-format", "download"]);

function applyDownload(a: HTMLAnchorElement, download: string | null): void {
    if (download === "false") a.removeAttribute("download");
    else a.setAttribute("download", download === null || download === "true" ? "" : download);
}

export class DownloadButton extends HTMLElement {
    // The text shown when the consumer gave none: the label, which then follows it.
    #labelText: Text | null = null;

    // A change to href, label, file-size, file-format, download or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const a = this.querySelector<HTMLAnchorElement>(":scope > a.download-button");
        if (!a) return;
        a.className = rootClassName(this, "download-button");
        const label = this.getAttribute("label");
        setOrRemove(a, "href", this.getAttribute("href"));
        setOrRemove(a, "aria-label", label);
        setOrRemove(a, "data-file-size", this.getAttribute("file-size"));
        setOrRemove(a, "data-file-format", this.getAttribute("file-format"));
        applyDownload(a, this.getAttribute("download"));
        if (this.#labelText) this.#labelText.data = label ?? "";
        else if (!a.hasChildNodes() && label !== null) {
            this.#labelText = document.createTextNode(label);
            a.appendChild(this.#labelText);
        }
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > a.download-button")) return;

        const label = this.getAttribute("label");

        const a = document.createElement("a");
        a.className = rootClassName(this, "download-button");
        const href = this.getAttribute("href");
        if (href !== null) a.href = href;
        if (label !== null) a.setAttribute("aria-label", label);

        const fileSize = this.getAttribute("file-size");
        if (fileSize !== null) a.setAttribute("data-file-size", fileSize);
        const fileFormat = this.getAttribute("file-format");
        if (fileFormat !== null) a.setAttribute("data-file-format", fileFormat);

        // "false" opts out: no download attribute at all.
        applyDownload(a, this.getAttribute("download"));

        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        if (!a.hasChildNodes() && label !== null) {
            this.#labelText = document.createTextNode(label);
            a.appendChild(this.#labelText);
        }

        this.appendChild(a);
    }
}
