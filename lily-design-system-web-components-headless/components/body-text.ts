// BodyText component
//
// A rendered text block within a content-width container. A plain <div> —
// the custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Intended to be used inside
// ContentBlock for width constraint. Inspired by Reuters Graphics'
// BodyText component.
//
// No attributes beyond the shared class hook — the host's own children
// (paragraphs, lists, etc.) stay exactly where they are.
//
// References:
//   - components/body-text/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class BodyText extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "body-text");
    }
}
