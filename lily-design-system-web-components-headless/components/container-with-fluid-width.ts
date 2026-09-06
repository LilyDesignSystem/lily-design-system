// ContainerWithFluidWidth component
//
// A full-width content wrapper with horizontal padding. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Deviation from the canonical AGENTS.md contract (and every other
// framework's port): the canonical contract applies the fluid width via
// an inline `style="width: 100%; padding-inline: …;"` attribute. This
// catalog's own written policy (AGENTS.md "STRICT Prohibitions") allows
// exactly two documented inline-style exceptions (FloatButton's
// `position: fixed`, ThemeProvider's `display: contents`) and says not
// to add a third without maintainer sign-off first. Rather than
// silently add a third exception, this component only exposes the
// `data-padding-inline` attribute (the same hook the canonical contract
// documents for consumer CSS) and leaves the actual `width` /
// `padding-inline` rule to the consumer's stylesheet, e.g.:
//
//   .container-with-fluid-width {
//     width: 100%;
//     padding-inline: attr(data-padding-inline type(<length>), 1rem);
//   }
//
// Flagged for maintainer review rather than assumed.
//
// Attributes:
//   padding-inline — default "1rem". Exposed as data-padding-inline.
//
// References:
//   - components/container-with-fluid-width/index.md (canonical contract)
//   - MDN padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline

import { applySelfClassName } from "../lib/dom-utils.js";

export class ContainerWithFluidWidth extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "container-with-fluid-width");
        this.setAttribute("data-padding-inline", this.getAttribute("padding-inline") ?? "1rem");
    }
}
