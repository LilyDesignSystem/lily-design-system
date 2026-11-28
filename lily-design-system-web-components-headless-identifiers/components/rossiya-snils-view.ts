// RossiyaSnilsView component
//
// A headless read-only display of Russia's СНИЛС (SNILS).
// Format: Eleven digits, NNN-NNN-NNN CC, a Modulus-101 check value over the first nine.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/rossiya-snils-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/SNILS

import { IdentifierView } from "../lib/identifier-view.js";

export class RossiyaSnilsView extends IdentifierView {
    protected readonly baseClass = "rossiya-snils-view";
}
