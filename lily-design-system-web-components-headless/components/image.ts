// Image component
//
// A plain <img>. For a caption, wrap it in <lily-figure> with a
// <lily-caption>.
//
// Attributes:
//   src — REQUIRED. The image source URL.
//   alt — REQUIRED. Alternative text describing the image.
//   loading — "lazy" | "eager", optional.
//
// References:
//   - components/image/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "alt", "loading"]);

export class Image extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > img.image")) return;

        const img = document.createElement("img");
        img.className = rootClassName(this, "image");
        img.src = this.getAttribute("src") ?? "";
        img.alt = this.getAttribute("alt") ?? "";
        const loading = this.getAttribute("loading");
        if (loading === "lazy" || loading === "eager") img.setAttribute("loading", loading);
        passThroughAttributes(this, img, HANDLED);

        this.appendChild(img);
    }
}
