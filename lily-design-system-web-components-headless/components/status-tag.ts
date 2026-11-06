// StatusTag component
//
// A tag showing the current status of a task. Wraps a real <span>. The
// semantics are conveyed by the visible text (and optionally aria-label)
// — colour alone is never the indicator.
//
// DEVIATION FLAG: the canonical docs (components/status-tag/AGENTS.md)
// are internally consistent with react-headless and vue-headless (no
// role, no data-* tone attribute) but the Svelte canonical implementation
// unconditionally sets role="status" and reads a `type` prop it renders
// as data-type — neither of which matches the canonical AGENTS.md prose
// ("role='status' is NOT applied by default", prop name "tone"). Since
// two of the three concrete reference implementations and the written
// contract agree, this port follows the documented, majority shape: no
// role, and `tone` (matching the documented prop name) exposed as
// data-tone for consumer styling.
//
// Attributes:
//   label — optional; hidden text read before the content, because a
//     <span> cannot take a name.
//   tone — "neutral" | "success" | "warning" | "danger" | "info",
//     default "neutral". Exposed as data-tone.
//
// References:
//   - components/status-tag/index.md (canonical contract)
//   - GOV.UK Tag pattern: https://design-system.service.gov.uk/components/tag/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "tone"]);

export class StatusTag extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.status-tag")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "status-tag");
        span.setAttribute("data-tone", this.getAttribute("tone") ?? "neutral");
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        const label = this.getAttribute("label");
        if (label) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${label} `;
            span.prepend(hidden);
        }
        this.appendChild(span);
    }
}
