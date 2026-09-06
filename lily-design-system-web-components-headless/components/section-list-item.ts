// SectionListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). A <ul> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Deviation from the canonical AGENTS.md Props table (which lists only
// `children` and `...restProps`): every real implementation (React, Vue)
// accepts an optional `label` prop rendered as aria-label. The parallel
// Svelte implementation destructures a same-named prop but never applies
// it (a real, unrelated defect in that file) and instead applies a
// `current` prop absent from every other catalog and from this component's
// own AGENTS.md — not followed here, since it is not corroborated
// elsewhere. Followed the two-catalog, working `label` → aria-label
// behaviour.
//
// Attributes:
//   label — optional; sets aria-label on the <li>.
//   ...rest — spread onto the <li>. Children move into the <li> unchanged.
//
// References:
//   - components/section-list-item/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class SectionListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "section-list-item");
        const label = this.getAttribute("label");
        if (label !== null) li.setAttribute("aria-label", label);
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
