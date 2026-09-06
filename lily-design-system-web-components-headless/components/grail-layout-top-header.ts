// GrailLayoutTopHeader component
//
// A headless landmark for the top, full-width header region of a
// GrailLayout composition (see AGENTS/components.md "Grail layout
// pattern"). Renders a native <header>; no aria-label prop exists in the
// canonical contract (confirmed against every other framework's port —
// none of them declares one).
//
// Attributes:
//   ...rest — spread onto the <header>, including aria-label if the
//     consumer supplies one.
//
// References:
//   - components/grail-layout-top-header/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class GrailLayoutTopHeader extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > header.grail-layout-top-header")) return;

        const header = document.createElement("header");
        header.className = rootClassName(this, "grail-layout-top-header");
        passThroughAttributes(this, header, HANDLED);

        moveChildrenInto(this, header);
        this.appendChild(header);
    }
}
