// PortugalPassaporteView component
//
// A headless read-only display of Portugal's Passaporte.
// Format: 1 letter [A-Z] and 6 digits [0-9].
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/portugal-passaporte-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Portuguese_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class PortugalPassaporteView extends IdentifierView {
    protected readonly baseClass = "portugal-passaporte-view";
}
