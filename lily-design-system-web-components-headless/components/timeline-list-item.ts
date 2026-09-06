// TimelineListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). An <ol> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Deviation from the canonical AGENTS.md Props table (children + restProps
// only): every real implementation (Svelte, React, Vue) also accepts
// optional `datetime` + `heading` props that render a machine-readable
// <time> element ahead of the children — followed the real cross-catalog
// implementation.
//
// Attributes:
//   datetime — optional. ISO date/time string for the <time> element.
//   heading — optional. Visible date/time text inside the <time> element.
//     The <time> renders only when at least one of datetime/heading is set.
//   ...rest — spread onto the <li>. Remaining children render after the
//     <time>.
//
// References:
//   - components/timeline-list-item/index.md (canonical contract)
//   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["datetime", "heading"]);

export class TimelineListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "timeline-list-item");
        passThroughAttributes(this, li, HANDLED);

        const datetime = this.getAttribute("datetime") ?? "";
        const heading = this.getAttribute("heading") ?? "";
        if (datetime || heading) {
            const time = document.createElement("time");
            if (datetime) time.dateTime = datetime;
            time.textContent = heading;
            li.appendChild(time);
        }

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
