// NederlandPaspoortNummerView component
//
// A headless read-only display of the Netherlands's Paspoort Nummer.
// Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/nederland-paspoort-nummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Dutch_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class NederlandPaspoortNummerView extends IdentifierView {
    protected readonly baseClass = "nederland-paspoort-nummer-view";
}
