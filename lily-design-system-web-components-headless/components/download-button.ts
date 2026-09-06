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

const HANDLED = new Set(["href", "label", "file-size", "file-format", "download"]);

export class DownloadButton extends HTMLElement {
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

        const download = this.getAttribute("download");
        if (download === "false") {
            // Explicitly opted out — no download attribute at all.
        } else if (download === null || download === "" || download === "true") {
            a.setAttribute("download", "");
        } else {
            a.setAttribute("download", download);
        }

        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        if (!a.hasChildNodes() && label !== null) a.textContent = label;

        this.appendChild(a);
    }
}
