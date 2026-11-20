// ToolBar component
//
// A <div role="toolbar"> horizontal bar of tool actions, with
// roving-focus arrow-key navigation between its enabled focusable children. No
// native element behaviour is worth deferring to for a plain `<div>`, so
// the custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — REQUIRED. Accessible name for the toolbar, via aria-label.
//
// Keyboard (the shared attachToolbar in lib/widget-keys; the toolbar contract holds every port to it):
//   ArrowRight — focus the next enabled item, wrapping to the first; ArrowLeft in right-to-left.
//   ArrowLeft — focus the previous enabled item, wrapping to the last; ArrowRight in right-to-left.
//   ArrowDown / ArrowUp instead, with aria-orientation="vertical".
//   Home — focus the first item.
//   End — focus the last item.
//   One item at a time is the tab stop, and it follows focus.
//
// References:
//   - components/tool-bar/index.md (canonical contract)
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import { applySelfClassName } from "../lib/dom-utils.js";
import { attachToolbar } from "../lib/widget-keys.js";

export class ToolBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tool-bar");
        this.setAttribute("role", "toolbar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        // The shared toolbar keys: one tab stop, arrows that skip a disabled control and swap in right-to-left, Home, End.
        attachToolbar(this);
    }
}
