// Draft component
//
// An early preliminary version of content (an article, email, report,
// …): a plain <div>. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible label for the draft, via aria-label.
//   status — optional. Editorial state (e.g. "in-progress", "review",
//     "ready-to-publish"), exposed as data-status.
//
// References:
//   - components/draft/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";
import { LiveElement, setOrRemove } from "../lib/live-element.js";

// A change to label, status or class is shown (tasks.md P50-T28).
export class Draft extends LiveElement {
    static get observedAttributes(): string[] {
        return ["label", "status", "class"];
    }

    protected update(): void {
        applySelfClassName(this, "draft");
        const label = this.getAttribute("label");
        setOrRemove(this, "aria-label", label);
        if (label !== null && !this.hasAttribute("role")) this.setAttribute("role", "group");
        setOrRemove(this, "data-status", this.getAttribute("status"));
    }
}
