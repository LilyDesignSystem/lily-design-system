// TagGroup component
//
// A <div role="group"> grouping consumer-supplied tag elements. The
// custom element stands in for the wrapper div directly (self-is-wrapper
// — see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element; light-DOM children
// stay exactly where the consumer put them.
//
// Note: the plain-HTML sibling (lily-design-system-html-headless/
// components/tag-group.html) ships without role="group" in its shipped
// markup, but the canonical AGENTS.md/index.md contract documents
// role="group" explicitly — that's followed here as the source of truth.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — already present on the host; nothing further is copied
//     onto it (self-is-wrapper has no separate target element).
//
// References:
//   - components/tag-group/index.md (canonical contract)
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import { applySelfClassName } from "../lib/dom-utils.js";

export class TagGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tag-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
