// ScreenReaderSpan component
//
// A visually hidden span of text intended for screen readers, providing
// more descriptive labels. NOTE: the canonical svelte-headless source
// renders a <div> — a real outlier against its own AGENTS.md metadata,
// index.md, html-headless scaffold, and every other framework port
// (react/vue/angular all render a real <span>). Followed here as the
// majority, doc-matching contract: a <span>.
//
// Attributes:
//   label — optional. Accessible label, via aria-label.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/screen-reader-span/index.md (canonical contract)
//   - WebAIM: https://webaim.org/techniques/css/invisiblecontent/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ScreenReaderSpan extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.screen-reader-span")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "screen-reader-span");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
