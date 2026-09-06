// ToggleGroup component
//
// A <div role="group"> grouping consumer-supplied toggle buttons (e.g.
// ToggleButton). Self-is-wrapper — see lib/dom-utils.applySelfClassName —
// since <div> has no native behaviour worth preserving as a separate
// element; light-DOM children stay exactly where the consumer put them.
// Each child toggle manages its own independent pressed/aria-pressed (or
// aria-checked, for ToggleButton's switch pattern) state; this component
// owns no selection state of its own.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   ...rest — already present on the host; nothing further is copied
//     onto it (self-is-wrapper has no separate target element).
//
// References:
//   - components/toggle-group/index.md (canonical contract)
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
//   - WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { applySelfClassName } from "../lib/dom-utils.js";

export class ToggleGroup extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "toggle-group");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
