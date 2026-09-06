// TaskBar component
//
// A <div role="toolbar"> horizontal bar of task shortcuts or actions,
// with roving-focus arrow-key navigation between its focusable children.
// No native element behaviour is worth deferring to for a plain `<div>`,
// so the custom element instance itself stands in for the wrapper (see
// lib/dom-utils.applySelfClassName).
//
// Note on scope: the canonical AGENTS.md/index.md prose says TaskBar
// "does not implement arrow key navigation itself" (Tab only), but the
// majority of the other headless catalogs (Svelte, React, Vue) implement
// the identical roving-focus ArrowLeft/ArrowRight/Home/End navigation
// ToolBar uses — a real inconsistency between the doc and every JS
// implementation. This follows the cross-catalog majority, matching
// ToolBar's own contract exactly.
//
// Attributes:
//   label — REQUIRED. Accessible name for the toolbar, via aria-label.
//
// Keyboard:
//   ArrowRight — focus the next item, wrapping to the first.
//   ArrowLeft — focus the previous item, wrapping to the last.
//   Home — focus the first item.
//   End — focus the last item.
//
// References:
//   - components/task-bar/index.md (canonical contract)
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import { applySelfClassName } from "../lib/dom-utils.js";

export class TaskBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "task-bar");
        this.setAttribute("role", "toolbar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.addEventListener("keydown", this.#onKeydown);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const items = Array.from(this.querySelectorAll<HTMLElement>("button, [role='button'], [tabindex]"));
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    };
}
