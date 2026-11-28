// SlovenijaEmsoView component
//
// A headless read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO).
// Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/slovenija-emso-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

import { IdentifierView } from "../lib/identifier-view.js";

export class SlovenijaEmsoView extends IdentifierView {
    protected readonly baseClass = "slovenija-emso-view";
}
