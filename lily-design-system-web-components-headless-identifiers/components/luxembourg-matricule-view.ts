// LuxembourgMatriculeView component
//
// A headless read-only display of Luxembourg's Numéro d'Identification Nationale (Matricule).
// Format: Thirteen digits, YYYYMMDDNNNCC: date of birth, sequence number, a Luhn check digit, then a Verhoeff check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/luxembourg-matricule-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Luxembourg

import { IdentifierView } from "../lib/identifier-view.js";

export class LuxembourgMatriculeView extends IdentifierView {
    protected readonly baseClass = "luxembourg-matricule-view";
}
