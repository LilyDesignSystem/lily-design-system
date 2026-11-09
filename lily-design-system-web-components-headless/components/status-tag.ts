// StatusTag component
//
// A tag showing the current status of a task. Wraps a real <span>. The
// semantics are conveyed by the visible text (and optionally aria-label)
// — colour alone is never the indicator.
//
// The status is `type`, rendered as data-type, as in Svelte and as on alert, badge and banner (decided
// 2026-11-09, tasks.md P22-T32). The older `tone` attribute this port took is still read, with its values
// mapped (neutral to default, danger to error), so existing markup keeps its colour.
//
// Attributes:
//   label — optional; hidden text read before the content, because a
//     <span> cannot take a name.
//   type — "default" | "info" | "success" | "warning" | "error", default
//     "default". Rendered as data-type.
//   tone — deprecated: the older name, read when `type` is absent.
//
// References:
//   - components/status-tag/index.md (canonical contract)
//   - GOV.UK Tag pattern: https://design-system.service.gov.uk/components/tag/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "type", "tone"]);
const FROM_TONE: Record<string, string> = { neutral: "default", danger: "error" };

export class StatusTag extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.status-tag")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "status-tag");
        const tone = this.getAttribute("tone");
        span.setAttribute(
            "data-type",
            this.getAttribute("type") ?? (tone ? (FROM_TONE[tone] ?? tone) : "default"),
        );
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
