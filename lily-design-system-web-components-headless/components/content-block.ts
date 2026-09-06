// ContentBlock component
//
// A content-width-constraint container with a named column width,
// inspired by the Reuters Graphics Block component. The custom element
// stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). No ARIA — purely presentational;
// the actual width constraint is the consumer's CSS, keyed off
// `data-width`.
//
// Attributes:
//   width — "narrower" | "narrow" | "normal" | "wide" | "wider" |
//     "wider" | "widest" | "fluid", default "normal". Exposed as
//     data-width.
//
// References:
//   - components/content-block/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class ContentBlock extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "content-block");
        this.setAttribute("data-width", this.getAttribute("width") ?? "normal");
    }
}
