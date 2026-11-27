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
import { LiveElement } from "../lib/live-element.js";

const HANDLED = new Set(["label"]);

// Its content is the consumer's children, which they change directly; a change to class is shown (tasks.md P50-T28).
export class ScreenReaderSpan extends LiveElement {
    static get observedAttributes(): string[] {
        return ["class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLElement>(":scope > span.screen-reader-span");
        if (existing) {
            existing.className = rootClassName(this, "screen-reader-span");
            return;
        }
        const span = document.createElement("span");
        span.className = rootClassName(this, "screen-reader-span");
        passThroughAttributes(this, span, HANDLED);
        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
