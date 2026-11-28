// SlovenskoRodneCisloView component
//
// A headless read-only display of Slovakia's Rodné číslo (RČ).
// Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/slovensko-rodne-cislo-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

import { IdentifierView } from "../lib/identifier-view.js";

export class SlovenskoRodneCisloView extends IdentifierView {
    protected readonly baseClass = "slovensko-rodne-cislo-view";
}
