// Byline component
//
// An author attribution with publish and update timestamps. A plain <div>
// — the custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Inspired by Reuters Graphics' Byline
// component.
//
// Deviation: the canonical contract describes three separate slots
// (author names/links, a publish timestamp, an update timestamp), but
// this catalog is light-DOM-only with no named-slot mechanism, and
// css-style-sheet-template.css defines no `byline-authors` /
// `byline-published` sub-class hooks. The consumer's single children slot
// therefore carries all three — author markup and any `<time datetime="…">`
// elements together — exactly as authored, with no forced sub-structure.
//
// Attributes:
//   label — optional. Accessible name via aria-label.
//
// References:
//   - components/byline/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Byline extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "byline");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
