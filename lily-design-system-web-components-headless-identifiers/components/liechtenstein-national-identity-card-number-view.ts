// LiechtensteinNationalIdentityCardNumberView component
//
// A headless read-only display of Liechtenstein's national identity card number.
// Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/liechtenstein-national-identity-card-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identity_card

import { IdentifierView } from "../lib/identifier-view.js";

export class LiechtensteinNationalIdentityCardNumberView extends IdentifierView {
    protected readonly baseClass = "liechtenstein-national-identity-card-number-view";
}
