// FeaturePhoto component
//
// A <figure class="feature-photo"> with an <img> and an optional
// <figcaption> built from `caption` and `credit` light-DOM slots — since
// this catalog uses light DOM (no shadow root), "slot" here means a
// child element marked `slot="caption"` / `slot="credit"`, which this
// component distributes into the figcaption itself, the same technique
// every other light-DOM Web Components library uses in place of a real
// <slot>.
//
// Attributes:
//   src, alt — REQUIRED. Image source and alt text.
//   loading — "lazy" | "eager", default "lazy".
//   width, height — optional; set on the <img> to reserve layout space.
//
// Usage:
//   <lily-feature-photo src="…" alt="…">
//     <span slot="caption">A rescue dog at the shelter.</span>
//     <span slot="credit">Photo: Jane Doe</span>
//   </lily-feature-photo>
//
// References:
//   - components/feature-photo/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "alt", "loading", "width", "height"]);

export class FeaturePhoto extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figure.feature-photo")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "feature-photo");
        passThroughAttributes(this, figure, HANDLED);

        const img = document.createElement("img");
        img.src = this.getAttribute("src") ?? "";
        img.alt = this.getAttribute("alt") ?? "";
        img.loading = (this.getAttribute("loading") as "lazy" | "eager" | null) ?? "lazy";
        const width = this.getAttribute("width");
        if (width !== null) img.width = Number(width);
        const height = this.getAttribute("height");
        if (height !== null) img.height = Number(height);
        figure.appendChild(img);

        const caption = this.querySelector('[slot="caption"]');
        const credit = this.querySelector('[slot="credit"]');
        if (caption || credit) {
            const figcaption = document.createElement("figcaption");
            if (caption) figcaption.appendChild(caption);
            if (credit) figcaption.appendChild(credit);
            figure.appendChild(figcaption);
        }

        this.replaceChildren();
        this.appendChild(figure);
    }
}
