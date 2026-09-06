// Watermark component
//
// A decorative repeating overlay text or image marking a page. Renders a
// <div>; the custom element stands in for that div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. The headless implementation
// exposes the configuration as data-* attributes; the consumer is
// responsible for the actual repeating-pattern CSS.
//
// Attributes:
//   text — optional. Watermark text.
//   image-url — optional. Watermark image URL (alternative to text).
//   gap — default "100px". Spacing between repeats (CSS length).
//   rotate — number (deg), default -22. Rotation angle.
//
// The consumer's original children render beneath the (decorative,
// aria-hidden) overlay, which is inserted as the first child.
//
// References:
//   - components/watermark/index.md (canonical contract)
//   - WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
//   - Ant Design Watermark: https://ant.design/components/watermark

import { applySelfClassName } from "../lib/dom-utils.js";

export class Watermark extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "watermark");
        this.setAttribute("data-rotate", this.getAttribute("rotate") ?? "-22");
        this.setAttribute("data-gap", this.getAttribute("gap") ?? "100px");

        const overlay = document.createElement("div");
        overlay.className = "watermark-overlay";
        overlay.setAttribute("aria-hidden", "true");
        const text = this.getAttribute("text");
        if (text !== null) overlay.setAttribute("data-text", text);
        const imageUrl = this.getAttribute("image-url");
        if (imageUrl !== null) overlay.setAttribute("data-image-url", imageUrl);

        this.insertBefore(overlay, this.firstChild);
    }
}
