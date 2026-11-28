// SverigePersonnummerView component
//
// A headless read-only display of Sweden's Personnummer.
// Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/sverige-personnummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

import { IdentifierView } from "../lib/identifier-view.js";

export class SverigePersonnummerView extends IdentifierView {
    protected readonly baseClass = "sverige-personnummer-view";
}
