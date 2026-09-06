// GrailLayoutCenterMain component
//
// The center region of the GrailLayout composition pattern (GrailLayout >
// TopHeader, LeftAside, CenterMain, RightAside, BottomFooter). A native
// <main> landmark holding the page's primary content.
//
// Deviation from the canonical AGENTS.md's own "Key Behaviors" field
// (which says "renders a <div>"), which contradicts that same file's
// "HTML tag: <main>" metadata field: every real cross-catalog
// implementation (svelte, html) renders a <main>. Followed "HTML tag" per
// headless.md's own rule that it is the single source of truth, confirmed
// by the unanimous real implementations.
//
// Attributes:
//   ...rest — spread onto the <main>.
//
// References:
//   - components/grail-layout-center-main/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class GrailLayoutCenterMain extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > main.grail-layout-center-main")) return;

        const main = document.createElement("main");
        main.className = rootClassName(this, "grail-layout-center-main");
        passThroughAttributes(this, main, HANDLED);

        moveChildrenInto(this, main);
        this.appendChild(main);
    }
}
