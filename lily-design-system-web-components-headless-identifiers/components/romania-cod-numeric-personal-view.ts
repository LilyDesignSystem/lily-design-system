// RomaniaCodNumericPersonalView component
//
// A headless read-only display of Romania's Cod Numeric Personal (CNP).
// Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/romania-cod-numeric-personal-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Romania

import { IdentifierView } from "../lib/identifier-view.js";

export class RomaniaCodNumericPersonalView extends IdentifierView {
    protected readonly baseClass = "romania-cod-numeric-personal-view";
}
