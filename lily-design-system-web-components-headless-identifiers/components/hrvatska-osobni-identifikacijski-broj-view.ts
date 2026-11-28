// HrvatskaOsobniIdentifikacijskiBrojView component
//
// A headless read-only display of Croatia's Osobni identifikacijski broj (OIB).
// Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/hrvatska-osobni-identifikacijski-broj-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

import { IdentifierView } from "../lib/identifier-view.js";

export class HrvatskaOsobniIdentifikacijskiBrojView extends IdentifierView {
    protected readonly baseClass = "hrvatska-osobni-identifikacijski-broj-view";
}
