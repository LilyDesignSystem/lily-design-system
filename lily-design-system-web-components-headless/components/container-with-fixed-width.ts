// ContainerWithFixedWidth component
//
// A centered content wrapper with a fixed max-width breakpoint. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Deviation from the canonical AGENTS.md contract (and every other
// framework's port): the canonical contract applies the max-width
// centering via an inline `style="max-width: …; margin-inline: auto;"`
// attribute. This catalog's own written policy (AGENTS.md "STRICT
// Prohibitions") allows exactly two documented inline-style exceptions
// (FloatButton's `position: fixed`, ThemeProvider's `display: contents`)
// and says not to add a third without maintainer sign-off first. Rather
// than silently add a third exception, this component only exposes the
// `data-max-width` attribute (the same hook the canonical contract
// documents for consumer CSS) and leaves the actual `max-width` /
// `margin-inline` rule to the consumer's stylesheet, e.g.:
//
//   .container-with-fixed-width {
//     max-width: attr(data-max-width type(<length>), 1200px);
//     margin-inline: auto;
//   }
//
// Flagged for maintainer review rather than assumed.
//
// Attributes:
//   max-width — default "1200px". Exposed as data-max-width.
//
// References:
//   - components/container-with-fixed-width/index.md (canonical contract)
//   - MDN max-width: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width

import { applySelfClassName } from "../lib/dom-utils.js";

export class ContainerWithFixedWidth extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "container-with-fixed-width");
        this.setAttribute("data-max-width", this.getAttribute("max-width") ?? "1200px");
    }
}
