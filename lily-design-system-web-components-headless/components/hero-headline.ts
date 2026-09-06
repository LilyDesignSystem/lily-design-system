// HeroHeadline component
//
// A full-bleed hero section with headline content overlaid on
// background media. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). Since this catalog
// uses light DOM (no shadow root), the background media is a light-DOM
// child marked `slot="media"` — the same technique feature-photo.ts
// uses for its caption/credit slots. Every other child (the overlaid
// headline content) moves into a generated content wrapper.
//
// Attributes:
//   label — REQUIRED. Accessible label for the hero section, via
//     aria-label.
//
// Usage:
//   <lily-hero-headline label="Feature story">
//     <img slot="media" src="hero.jpg" alt="Aerial view of city" />
//     <h1>The Changing Skyline</h1>
//   </lily-hero-headline>
//
// References:
//   - components/hero-headline/index.md (canonical contract)

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class HeroHeadline extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "hero-headline");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const media = this.querySelector('[slot="media"]');
        const mediaWrap = document.createElement("div");
        mediaWrap.className = "hero-headline-media";
        if (media) mediaWrap.appendChild(media);

        const contentWrap = document.createElement("div");
        contentWrap.className = "hero-headline-content";
        moveChildrenInto(this, contentWrap);

        this.replaceChildren(mediaWrap, contentWrap);
    }
}
