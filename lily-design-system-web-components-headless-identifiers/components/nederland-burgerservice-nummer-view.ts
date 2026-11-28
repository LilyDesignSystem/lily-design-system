// NederlandBurgerserviceNummerView component
//
// A headless read-only display of the Netherlands's Burgerservicenummer (BSN).
// Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/nederland-burgerservice-nummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Burgerservicenummer

import { IdentifierView } from "../lib/identifier-view.js";

export class NederlandBurgerserviceNummerView extends IdentifierView {
    protected readonly baseClass = "nederland-burgerservice-nummer-view";
}
