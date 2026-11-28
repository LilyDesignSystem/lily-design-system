// SriLankaNationalIdentityCardView component
//
// A headless read-only display of Sri Lanka's National Identity Card (NIC) number.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/sri-lanka-national-identity-card-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)

import { IdentifierView } from "../lib/identifier-view.js";

export class SriLankaNationalIdentityCardView extends IdentifierView {
    protected readonly baseClass = "sri-lanka-national-identity-card-view";
}
