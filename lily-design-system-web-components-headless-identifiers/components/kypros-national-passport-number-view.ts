// KyprosNationalPassportNumberView component
//
// A headless read-only display of Kypros's National Passport Number.
// Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g.
//   E123456); biometric passports issued after 13/12/2010 begin with 'K'
//   followed by 8 digits (e.g. K12345678).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/kypros-national-passport-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Cypriot_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class KyprosNationalPassportNumberView extends IdentifierView {
    protected readonly baseClass = "kypros-national-passport-number-view";
}
