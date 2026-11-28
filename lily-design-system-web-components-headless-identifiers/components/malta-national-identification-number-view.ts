// MaltaNationalIdentificationNumberView component
//
// A headless read-only display of Malta's national identification number.
// Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/malta-national-identification-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Malta

import { IdentifierView } from "../lib/identifier-view.js";

export class MaltaNationalIdentificationNumberView extends IdentifierView {
    protected readonly baseClass = "malta-national-identification-number-view";
}
