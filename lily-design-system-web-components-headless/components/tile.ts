// Tile component
//
// A grouping container that presents related content in a structured
// format. Renders a <div>; the custom element stands in for that div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// DEVIATION FLAG: the canonical AGENTS.md describes an "interactive"
// variant (tabindex="0" + role="button" + onclick when `interactive` is
// true) that none of the three cross-checked reference implementations
// (Svelte, React, Vue) actually build — all three render the simpler
// shape below (an optional aria-label + children, no interactivity).
// This port follows the implemented cross-framework consensus; a
// consumer wanting a clickable tile can wrap this in — or pass — a real
// <button>.
//
// Attributes:
//   label — optional; aria-label for the tile.
//
// References:
//   - components/tile/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Tile extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tile");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
