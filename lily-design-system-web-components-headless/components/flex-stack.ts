// FlexStack component
//
// A headless flex layout container for vertical or horizontal stacking
// with a consistent gap. The custom element stands in for the wrapper
// div directly (see lib/dom-utils.applySelfClassName) since <div> has
// no native behaviour worth preserving as a separate element.
//
// DEVIATION FROM THE CANONICAL CONTRACT (flagged, not hidden): the
// canonical components/flex-stack/AGENTS.md and every reactive-framework
// port (react/svelte/vue) — and even the static html-headless port —
// apply direction/gap/align/justify as an inline `style` (`display:
// flex; flex-direction: …; gap: …;`), documented there as the layout
// behaviour itself, not decorative CSS. This package's own AGENTS.md
// carries a stricter, catalog-specific rule: "No CSS/styles — no inline
// styles beyond the one documented structural exception (FloatButton's
// position: fixed) — do not add another without flagging it to me
// first." Rather than add a second, unapproved exception, this
// implementation exposes direction/gap/align/justify only via data-*
// attributes, matching this catalog's existing data-attribute
// convention for consumer-CSS-driven state (see e.g.
// color-picker-button's data-color). A consumer supplies
// `[data-direction="row"] { display: flex; flex-direction: row; gap:
// var(--gap, 1rem); }`-style CSS (or reads `data-gap`/`data-align`/
// `data-justify` directly). Flagged for a maintainer decision on
// whether to add the inline-style exception catalog-wide instead.
//
// Attributes:
//   direction — "row" | "column", default "column". Exposed via
//     data-direction (NOT applied as inline style — see above).
//   gap — default "1rem". Exposed via data-gap.
//   align — optional. Exposed via data-align when present.
//   justify — optional. Exposed via data-justify when present.
//
// References:
//   - components/flex-stack/index.md (canonical contract)
//   - MDN flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

import { applySelfClassName } from "../lib/dom-utils.js";

export class FlexStack extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "flex-stack");
        const direction = this.getAttribute("direction") === "row" ? "row" : "column";
        this.setAttribute("data-direction", direction);
        this.setAttribute("data-gap", this.getAttribute("gap") ?? "1rem");
        const align = this.getAttribute("align");
        if (align !== null) this.setAttribute("data-align", align);
        const justify = this.getAttribute("justify");
        if (justify !== null) this.setAttribute("data-justify", justify);
    }
}
