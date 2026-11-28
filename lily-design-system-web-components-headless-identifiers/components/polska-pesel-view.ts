// PolskaPeselView component
//
// A headless read-only display of Poland's PESEL.
// Format: 11 numeric digits; assigned shortly after birth and unchanged for life.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/polska-pesel-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/PESEL

import { IdentifierView } from "../lib/identifier-view.js";

export class PolskaPeselView extends IdentifierView {
    protected readonly baseClass = "polska-pesel-view";
}
