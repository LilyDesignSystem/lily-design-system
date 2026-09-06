// AccordionList component
//
// A grouped container of AccordionListItem components, one per collapsible
// section, within an AccordionNav. Renders a <div role="group"> — not an
// <ol> — because AccordionListItem renders a <details> element, and
// <details> is not a valid child of <ol>/<ul> (HTML content model). The
// custom element itself stands in for the wrapper div (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <ol>): the actual contract in every other framework (Svelte, React,
// html-headless) renders a <div role="group">, matching the "Note" left in
// components.md about AccordionListItem needing a non-list parent. Followed
// the real cross-catalog implementation rather than the stale metadata
// field.
//
// Attributes:
//   label — optional. Accessible name for the group, via aria-label. Only
//     rendered when non-empty (an empty/absent label omits aria-label
//     entirely, matching the other catalogs' `label || undefined`).
//   ...rest — spread onto `this` (the host is the rendered element).
//
// References:
//   - components/accordion-list/index.md (canonical contract)
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import { applySelfClassName } from "../lib/dom-utils.js";

export class AccordionList extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "accordion-list");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label) this.setAttribute("aria-label", label);
    }
}
