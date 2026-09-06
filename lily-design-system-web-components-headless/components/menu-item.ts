// MenuItem component
//
// One item in a Menu. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element — matching
// every framework's own port. Because the host IS the menuitem element,
// any further ARIA the consumer writes directly on the host (aria-disabled,
// aria-haspopup, aria-expanded for submenu triggers) is already present
// with no extra plumbing needed.
//
// Attributes: none beyond the standard rest-props already on the host.
//
// Keyboard: focus movement (ArrowUp/ArrowDown/Home/End) is managed by the
// parent Menu; Enter/Space activation is the consumer's own handler.
//
// References:
//   - components/menu-item/index.md (canonical contract)
//   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
//   - WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem

import { applySelfClassName } from "../lib/dom-utils.js";

export class MenuItem extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "menu-item");
        this.setAttribute("role", "menuitem");
        this.setAttribute("tabindex", "-1");
    }
}
