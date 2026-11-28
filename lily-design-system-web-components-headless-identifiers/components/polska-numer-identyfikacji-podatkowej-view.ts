// PolskaNumerIdentyfikacjiPodatkowejView component
//
// A headless read-only display of Poland's Numer Identyfikacji Podatkowej (NIP).
// Format: 10 numeric digits used for tax identification.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/polska-numer-identyfikacji-podatkowej-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Poland

import { IdentifierView } from "../lib/identifier-view.js";

export class PolskaNumerIdentyfikacjiPodatkowejView extends IdentifierView {
    protected readonly baseClass = "polska-numer-identyfikacji-podatkowej-view";
}
