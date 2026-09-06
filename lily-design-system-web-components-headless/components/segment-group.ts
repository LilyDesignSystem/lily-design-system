// SegmentGroup component
//
// A <div role="radiogroup"> grouping consumer-supplied SegmentGroupItem
// segments. Self-is-wrapper — see lib/dom-utils.applySelfClassName —
// since <div> has no native behaviour worth preserving as a separate
// element; light-DOM children (the segment-group-item buttons) stay
// exactly where the consumer put them.
//
// Note: the plain-HTML sibling (lily-design-system-html-headless/
// components/segment-group.html) ships role="group" in its shipped
// markup, but the canonical AGENTS.md/index.md contract documents
// role="radiogroup" explicitly (matching the WAI-ARIA Radio Group
// pattern its children's role="radio" requires) — that's followed here
// as the source of truth.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — already present on the host; nothing further is copied
//     onto it (self-is-wrapper has no separate target element).
//
// Keyboard: arrow-key navigation between segments and activation are the
// consumer's responsibility (documented as consumer-implemented in the
// canonical contract) — this component only supplies the group semantics.
//
// References:
//   - components/segment-group/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import { applySelfClassName } from "../lib/dom-utils.js";

export class SegmentGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "segment-group");
        this.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
