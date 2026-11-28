// DanmarkPersonnummerView component
//
// A headless read-only display of Denmark's Personnummer (CPR-nummer) (CPR).
// Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of
//   birth (DDMMYY).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/danmark-personnummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

import { IdentifierView } from "../lib/identifier-view.js";

export class DanmarkPersonnummerView extends IdentifierView {
    protected readonly baseClass = "danmark-personnummer-view";
}
