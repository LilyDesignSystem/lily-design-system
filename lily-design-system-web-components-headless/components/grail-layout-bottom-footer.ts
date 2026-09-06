// GrailLayoutBottomFooter component
//
// The bottom, full-width region of the GrailLayout composition pattern
// (GrailLayout > TopHeader, LeftAside, CenterMain, RightAside,
// BottomFooter). A native <footer> landmark holding site-wide footer
// content.
//
// Attributes:
//   ...rest — spread onto the <footer>.
//
// References:
//   - components/grail-layout-bottom-footer/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class GrailLayoutBottomFooter extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > footer.grail-layout-bottom-footer")) return;

        const footer = document.createElement("footer");
        footer.className = rootClassName(this, "grail-layout-bottom-footer");
        passThroughAttributes(this, footer, HANDLED);

        moveChildrenInto(this, footer);
        this.appendChild(footer);
    }
}
