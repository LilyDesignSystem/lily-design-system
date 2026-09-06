// ImageCropper component
//
// A headless container for cropping and resizing an image to a
// selected region. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). The consumer
// supplies the actual image and crop overlay UI (image, canvas, SVG
// handles, or a third-party cropping library) as light-DOM children.
//
// Attributes:
//   label — REQUIRED. Accessible description of the image cropper, via
//     aria-label.
//
// References:
//   - components/image-cropper/index.md (canonical contract)
//   - WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application

import { applySelfClassName } from "../lib/dom-utils.js";

export class ImageCropper extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "image-cropper");
        this.setAttribute("role", "application");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
