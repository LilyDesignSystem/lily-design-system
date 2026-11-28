// HangukJuminDeungnokBeonhoView component
//
// A headless read-only display of South Korea's Resident Registration Number (주민등록번호).
// Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth
// (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode
// place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check
// digit over the preceding twelve.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/hanguk-jumin-deungnok-beonho-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Resident_registration_number

import { IdentifierView } from "../lib/identifier-view.js";

export class HangukJuminDeungnokBeonhoView extends IdentifierView {
    protected readonly baseClass = "hanguk-jumin-deungnok-beonho-view";
}
