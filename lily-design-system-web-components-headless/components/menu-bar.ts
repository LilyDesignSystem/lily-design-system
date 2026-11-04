// MenuBar component
//
// A horizontal bar of menu triggers, using the WAI-ARIA menubar pattern
// with horizontal keyboard navigation between `[role="menuitem"]`
// descendants. The custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element — matching every
// framework's own port, which renders the same bare <div role="menubar">.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//
// Keyboard:
//   ArrowRight — focus the next menu bar item, wrapping to the first.
//   ArrowLeft — focus the previous menu bar item, wrapping to the last.
//   Home — focus the first menu bar item.
//   End — focus the last menu bar item.
//
// References:
//   - components/menu-bar/index.md (canonical contract)
//   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

import { applySelfClassName } from "../lib/dom-utils.js";
import { attachMenu } from "../lib/menu-keys.js";

export class MenuBar extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "menu-bar");
        this.setAttribute("role", "menubar");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        attachMenu(this, "horizontal");
    }
}
