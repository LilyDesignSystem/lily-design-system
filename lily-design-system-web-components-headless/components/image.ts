// Image component
//
// A plain <img> when no caption is provided, or a <figure><img><figcaption>
// when a caption is present.
//
// Attributes:
//   src — REQUIRED. The image source URL.
//   alt — REQUIRED. Alternative text describing the image.
//   caption — optional. When present, wraps the image in a <figure> with a
//     <figcaption>.
//   loading — "lazy" | "eager", optional. Always applied to the <img>
//     itself, in both branches.
//
// References:
//   - components/image/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "alt", "caption", "loading"]);

export class Image extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > img.image") || this.querySelector(":scope > figure.image")) return;

        const src = this.getAttribute("src") ?? "";
        const alt = this.getAttribute("alt") ?? "";
        const caption = this.getAttribute("caption");
        const loading = this.getAttribute("loading");

        if (caption !== null) {
            const figure = document.createElement("figure");
            figure.className = rootClassName(this, "image");
            passThroughAttributes(this, figure, HANDLED);

            const img = document.createElement("img");
            img.src = src;
            img.alt = alt;
            if (loading === "lazy" || loading === "eager") img.setAttribute("loading", loading);
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.textContent = caption;
            figure.appendChild(figcaption);

            this.appendChild(figure);
        } else {
            const img = document.createElement("img");
            img.className = rootClassName(this, "image");
            img.src = src;
            img.alt = alt;
            if (loading === "lazy" || loading === "eager") img.setAttribute("loading", loading);
            passThroughAttributes(this, img, HANDLED);

            this.appendChild(img);
        }
    }
}
