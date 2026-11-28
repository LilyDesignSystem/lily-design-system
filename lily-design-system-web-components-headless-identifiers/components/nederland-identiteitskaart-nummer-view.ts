// NederlandIdentiteitskaartNummerView component
//
// A headless read-only display of the Netherlands's Identiteitskaart Nummer.
// Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/nederland-identiteitskaart-nummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Dutch_identity_card

import { IdentifierView } from "../lib/identifier-view.js";

export class NederlandIdentiteitskaartNummerView extends IdentifierView {
    protected readonly baseClass = "nederland-identiteitskaart-nummer-view";
}
