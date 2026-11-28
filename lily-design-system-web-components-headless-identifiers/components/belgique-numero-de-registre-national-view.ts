// BelgiqueNumeroDeRegistreNationalView component
//
// A headless read-only display of Belgium's Numéro de Registre National /
// Rijksregisternummer (NRN).
// Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3
//   are an ordering number (uneven for men, even for women) and the last
//   2 a check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/belgique-numero-de-registre-national-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Belgium

import { IdentifierView } from "../lib/identifier-view.js";

export class BelgiqueNumeroDeRegistreNationalView extends IdentifierView {
    protected readonly baseClass = "belgique-numero-de-registre-national-view";
}
