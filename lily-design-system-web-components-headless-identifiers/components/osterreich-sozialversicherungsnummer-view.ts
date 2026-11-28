// OsterreichSozialversicherungsnummerView component
//
// A headless read-only display of Austria's Sozialversicherungsnummer (SVNR).
// Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/osterreich-sozialversicherungsnummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Austria

import { IdentifierView } from "../lib/identifier-view.js";

export class OsterreichSozialversicherungsnummerView extends IdentifierView {
    protected readonly baseClass = "osterreich-sozialversicherungsnummer-view";
}
