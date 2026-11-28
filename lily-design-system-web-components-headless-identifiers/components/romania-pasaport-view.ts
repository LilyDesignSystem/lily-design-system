// RomaniaPasaportView component
//
// A headless read-only display of Romania's Pașaport.
// Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/romania-pasaport-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Romanian_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class RomaniaPasaportView extends IdentifierView {
    protected readonly baseClass = "romania-pasaport-view";
}
