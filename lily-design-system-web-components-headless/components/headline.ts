// Headline component
//
// A page headline: a <div> containing a heading element at a configurable
// level (h1-h6), an optional subtitle, and an optional byline area. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Since this catalog uses light DOM
// (no shadow root), "subtitle" and "byline" are light-DOM children
// marked `slot="subtitle"` / `slot="byline"` — the same technique
// feature-photo.ts uses for its caption/credit slots. Every other child
// (default content) moves into the generated heading element.
//
// Attributes:
//   level — "1"-"6", default "1". Heading level.
//
// Usage:
//   <lily-headline level="2">
//     Economic Analysis
//     <span slot="subtitle">Q1 results show steady growth</span>
//     <span slot="byline">By Jane Smith</span>
//   </lily-headline>
//
// References:
//   - components/headline/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Headline extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "headline");

        const levelAttr = Number(this.getAttribute("level"));
        const level = levelAttr >= 1 && levelAttr <= 6 ? levelAttr : 1;

        const subtitle = this.querySelector('[slot="subtitle"]');
        const byline = this.querySelector('[slot="byline"]');

        const heading = document.createElement(`h${level}`);
        heading.className = "headline-heading";
        for (const node of Array.from(this.childNodes)) {
            if (node === subtitle || node === byline) continue;
            heading.appendChild(node);
        }

        this.replaceChildren(heading);

        if (subtitle) {
            const subtitleWrap = document.createElement("div");
            subtitleWrap.className = "headline-subtitle";
            subtitleWrap.appendChild(subtitle);
            this.appendChild(subtitleWrap);
        }

        if (byline) {
            const bylineWrap = document.createElement("div");
            bylineWrap.className = "headline-byline";
            bylineWrap.appendChild(byline);
            this.appendChild(bylineWrap);
        }
    }
}
