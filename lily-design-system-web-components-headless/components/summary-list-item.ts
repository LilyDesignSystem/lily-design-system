// SummaryListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale, adapted here for a <dl> parent instead of an
// <ol>/<ul>). A <dl> may only directly contain dt/dd pairs, <div> wrappers
// around dt/dd pairs, <script>, or <template> — never an arbitrary custom
// element — so this component builds the real <div> (containing a <dt> and
// a <dd>), moves the host's attributes/children into it, then replaces
// itself, exactly as BreadcrumbListItem does for <ol>/<li>.
//
// Deviation from the canonical AGENTS.md "HTML tag: <li>" metadata line:
// that file's own "Key Behaviors" and "Testing" prose both describe a
// <div> wrapping a <dt>/<dd> pair, and every real implementation (Svelte,
// React) renders exactly that, living inside a SummaryList's <dl> (not an
// <ol>/<ul>) — see summary-list.ts's own matching deviation note. The
// "HTML tag: <li>" line is inconsistent with the rest of its own document
// and was not followed.
//
// Attributes:
//   term — REQUIRED. Rendered as the <dt> text.
//   ...rest — spread onto the <div>. Children move into the <dd>.
//
// References:
//   - components/summary-list-item/index.md (canonical contract)
//   - MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
//   - HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["term"]);

export class SummaryListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const div = document.createElement("div");
        div.className = rootClassName(this, "summary-list-item");
        passThroughAttributes(this, div, HANDLED);

        const dt = document.createElement("dt");
        dt.textContent = this.getAttribute("term") ?? "";

        const dd = document.createElement("dd");
        moveChildrenInto(this, dd);

        div.appendChild(dt);
        div.appendChild(dd);
        this.replaceWith(div);
    }
}
