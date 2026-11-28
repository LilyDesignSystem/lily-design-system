// SchweizAhvNummerView component
//
// A headless read-only display of Switzerland's AHV-Nummer / Numéro AVS.
// Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix
// 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over
// the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit
// AHV card number on 1 July 2008.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/schweiz-ahv-nummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

import { IdentifierView } from "../lib/identifier-view.js";

export class SchweizAhvNummerView extends IdentifierView {
    protected readonly baseClass = "schweiz-ahv-nummer-view";
}
