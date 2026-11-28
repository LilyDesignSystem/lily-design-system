// BangladeshNationalIdentityCardView component
//
// A headless read-only display of Bangladesh's National ID (NID) number.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/bangladesh-national-identity-card-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)

import { IdentifierView } from "../lib/identifier-view.js";

export class BangladeshNationalIdentityCardView extends IdentifierView {
    protected readonly baseClass = "bangladesh-national-identity-card-view";
}
