// GrailLayout component
//
// A headless outer container for the classic "holy grail" web design
// structure — a full-width header, a left aside, a main content area, a
// right aside, and a full-width footer. The custom element stands in
// for the wrapper div directly (see lib/dom-utils.applySelfClassName).
// The consumer composes GrailLayoutTopHeader, GrailLayoutLeftAside,
// GrailLayoutCenterMain, GrailLayoutRightAside, and
// GrailLayoutBottomFooter as light-DOM children (implemented
// separately) and supplies CSS Grid or Flexbox for positioning; this
// component contributes no layout styles and no ARIA of its own.
//
// Attributes: none beyond the base class + rest-props (already present
// on the host).
//
// References:
//   - components/grail-layout/index.md (canonical contract)
//   - CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
//   - Holy Grail Layout: https://en.wikipedia.org/wiki/Holy_grail_(web_design)

import { applySelfClassName } from "../lib/dom-utils.js";

export class GrailLayout extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "grail-layout");
    }
}
