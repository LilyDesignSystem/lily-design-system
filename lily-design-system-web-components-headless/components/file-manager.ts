// FileManager component
//
// A file browser landmark for navigating and managing files: a <div
// role="region">. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). The consumer
// supplies all file listing, folder navigation, and action controls as
// light-DOM children — this component contributes only the named
// landmark.
//
// Attributes:
//   label — REQUIRED. Accessible name for the region, via aria-label.
//
// References:
//   - components/file-manager/index.md (canonical contract)
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

import { applySelfClassName } from "../lib/dom-utils.js";

export class FileManager extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "file-manager");
        this.setAttribute("role", "region");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
