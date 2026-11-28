// TurkiyeTcKimlikNumarasiView component
//
// A headless read-only display of Turkey's T.C. Kimlik Numarası.
// Format: Eleven digits; digits 10-11 are computed check digits, the last always even.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/turkiye-tc-kimlik-numarasi-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

import { IdentifierView } from "../lib/identifier-view.js";

export class TurkiyeTcKimlikNumarasiView extends IdentifierView {
    protected readonly baseClass = "turkiye-tc-kimlik-numarasi-view";
}
