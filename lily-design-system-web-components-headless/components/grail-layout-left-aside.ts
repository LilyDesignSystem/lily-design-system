// GrailLayoutLeftAside component
//
// A headless landmark for the left aside region of a GrailLayout
// composition (see AGENTS/components.md "Grail layout pattern"). Renders
// a native <aside>; no aria-label prop exists in the canonical contract
// (confirmed against every other framework's port — none of them declares
// one), so consumers wanting to distinguish multiple asides pass
// aria-label through as an ordinary rest attribute.
//
// Attributes:
//   ...rest — spread onto the <aside>, including aria-label if the
//     consumer supplies one.
//
// References:
//   - components/grail-layout-left-aside/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class GrailLayoutLeftAside extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > aside.grail-layout-left-aside")) return;

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "grail-layout-left-aside");
        passThroughAttributes(this, aside, HANDLED);

        moveChildrenInto(this, aside);
        this.appendChild(aside);
    }
}
