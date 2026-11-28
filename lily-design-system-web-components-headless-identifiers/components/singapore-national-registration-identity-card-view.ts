// SingaporeNationalRegistrationIdentityCardView component
//
// A headless read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN).
// Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign
// residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter
// is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the
// products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping
// (10 - remainder) through a lookup table to a letter.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/singapore-national-registration-identity-card-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_Registration_Identity_Card

import { IdentifierView } from "../lib/identifier-view.js";

export class SingaporeNationalRegistrationIdentityCardView extends IdentifierView {
    protected readonly baseClass = "singapore-national-registration-identity-card-view";
}
