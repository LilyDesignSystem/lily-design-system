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

function applyImage(host: HTMLElement, img: HTMLImageElement): void {
    img.src = host.getAttribute("src") ?? "";
    img.alt = host.getAttribute("alt") ?? "";
    img.loading = (host.getAttribute("loading") as "lazy" | "eager" | null) ?? "lazy";
    for (const name of ["width", "height"]) {
        const value = host.getAttribute(name);
        if (value !== null) img.setAttribute(name, String(Number(value)));
        else img.removeAttribute(name);
    }
}

export class FeaturePhoto extends HTMLElement {
    // A change to src, alt, loading, width, height or class is shown (tasks.md P50-T28); the caption and credit stay.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const figure = this.querySelector<HTMLElement>(":scope > figure.feature-photo");
        const img = figure?.querySelector<HTMLImageElement>(":scope > img");
        if (!figure || !img) return;
        figure.className = rootClassName(this, "feature-photo");
        applyImage(this, img);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > figure.feature-photo")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "feature-photo");
        passThroughAttributes(this, figure, HANDLED);

        const img = document.createElement("img");
        applyImage(this, img);
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
