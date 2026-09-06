// AspectRatioContainer component
//
// A container that maintains a fixed aspect ratio. A plain <div> — the
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Pure layout utility; no ARIA role
// needed, since content within maintains its own accessibility semantics.
//
// RESOLVED DEVIATION (was flagged during the 2026-09-06 batch as a
// candidate third inline-style exception): rather than setting
// `aspect-ratio` directly, this component sets only a CSS custom property
// (`--aspect-ratio-container-ratio`) via inline style — a form already
// pre-sanctioned by AGENTS/headless.md ("CSS custom properties applied as
// variables"), so it does not need a new named exception the way
// FloatButton's `position: fixed` and ThemeProvider's `display: contents`
// did. The actual `aspect-ratio` declaration belongs in the consumer's own
// stylesheet, targeting the `.aspect-ratio-container` class hook:
//   .aspect-ratio-container { aspect-ratio: var(--aspect-ratio-container-ratio, 1); }
// `data-aspect-ratio` is kept too, for a consumer who prefers reading the
// raw attribute over the CSS variable.
//
// Attributes:
//   ratio — number (width/height), default 1.
//   ...rest — spread onto `this` (the host is the rendered element).
//
// References:
//   - components/aspect-ratio-container/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class AspectRatioContainer extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["ratio"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "aspect-ratio-container");
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const ratio = this.getAttribute("ratio") ?? "1";
        this.style.setProperty("--aspect-ratio-container-ratio", ratio);
        this.setAttribute("data-aspect-ratio", ratio);
    }
}
