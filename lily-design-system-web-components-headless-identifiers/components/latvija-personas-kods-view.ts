// LatvijaPersonasKodsView component
//
// A headless read-only display of Latvia's Personas kods.
// Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/latvija-personas-kods-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Latvia

import { IdentifierView } from "../lib/identifier-view.js";

export class LatvijaPersonasKodsView extends IdentifierView {
    protected readonly baseClass = "latvija-personas-kods-view";
}
