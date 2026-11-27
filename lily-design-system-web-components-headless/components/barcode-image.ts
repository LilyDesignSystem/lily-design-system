// BarcodeImage component
//
// A single <img class="barcode-image">. Takes no children, since <img> is
// a void element (matches AvatarImage's shape).
//
// Attributes:
//   src — REQUIRED. The barcode image URL or data-URL.
//   alt — REQUIRED. Alternative text describing what the barcode encodes.
//   loading — "lazy" | "eager", optional; passes through to the <img>
//     unhandled, since it is already a native <img> attribute name.
//
// References:
//   - components/barcode-image/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "alt"]);

export class BarcodeImage extends HTMLElement {
    // A change to src, alt or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["src", "alt", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLImageElement>(":scope > img.barcode-image");
        if (!el) return;
        el.className = rootClassName(this, "barcode-image");
        el.src = this.getAttribute("src") ?? "";
        el.alt = this.getAttribute("alt") ?? "";
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > img.barcode-image")) return;

        const img = document.createElement("img");
        img.className = rootClassName(this, "barcode-image");
        img.src = this.getAttribute("src") ?? "";
        img.alt = this.getAttribute("alt") ?? "";
        passThroughAttributes(this, img, HANDLED);

        this.appendChild(img);
    }
}
