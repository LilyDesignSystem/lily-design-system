// CeskoRodneCisloView component
//
// A headless read-only display of Czech Republic's Rodné číslo (RČ).
// Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and
//   MM+50 for females; the ten-digit form ends in a check digit and is
//   usually divisible by 11.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/cesko-rodne-cislo-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

import { IdentifierView } from "../lib/identifier-view.js";

export class CeskoRodneCisloView extends IdentifierView {
    protected readonly baseClass = "cesko-rodne-cislo-view";
}
