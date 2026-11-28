// UnitedKingdomNationalInsuranceNumberView component
//
// A headless read-only display of United Kingdom's National Insurance Number (NINO).
// Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/united-kingdom-national-insurance-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_Insurance_number

import { IdentifierView } from "../lib/identifier-view.js";

export class UnitedKingdomNationalInsuranceNumberView extends IdentifierView {
    protected readonly baseClass = "united-kingdom-national-insurance-number-view";
}
