// Tour component
//
// A tour guide, such as for sightseeing, or pathways, or demonstrations,
// etc. — the outer container in the Tour/List/ListItem composition
// pattern. Renders a <div>; the custom element stands in for that div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// DEVIATION FLAG: the React canonical implementation duplicates a full
// role="dialog"/aria-modal/active/Escape contract on Tour itself — but
// this catalog's own already-shipped TourList (components/tour-list.ts)
// independently owns exactly that contract (role="dialog", aria-modal,
// an `active` attribute, and Escape-to-close), matching the canonical
// components/tour/AGENTS.md and index.md ("Renders a <div> element as the
// tour container... Children slot contains TourList with TourListItem
// steps"). Duplicating the dialog role here would nest two
// role="dialog"/aria-modal containers, a real accessibility defect. This
// port follows the documented, simpler contract: Tour is a passive
// wrapper; TourList owns the interactive dialog behaviour.
//
// Attributes:
//   label — REQUIRED. Accessible name for the tour, via aria-label.
//
// References:
//   - components/tour/index.md (canonical contract)
//   - components/tour-list.ts (owns the dialog/active/Escape contract)
//   - WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

import { applySelfClassName } from "../lib/dom-utils.js";

export class Tour extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tour");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
