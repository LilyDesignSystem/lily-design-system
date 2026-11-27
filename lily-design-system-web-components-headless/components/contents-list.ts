// ContentsList component
//
// A table-of-contents ordered list containing ContentsListItem components,
// designed to live inside a ContentsNav landmark (the nav supplies the
// accessible name — this component has no `label` prop of its own).
//
// Deviation from the canonical AGENTS.md "Key Behaviors" prose (which
// describes this component itself rendering a <nav aria-label>): every
// actual implementation (Svelte, React, html-headless) renders a bare
// <ol> with no label prop and no nav wrapper — that landmark role belongs
// to the sibling ContentsNav component. Followed the real cross-catalog
// implementation.
//
// Attributes:
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/contents-list/index.md (canonical contract)
//   - MDN ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followClass,
} from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class ContentsList extends HTMLElement {
    // Its content is the consumer's children, which they change directly; a change to class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(): void {
        followClass(this, "ol.contents-list", "contents-list");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > ol.contents-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "contents-list");
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
