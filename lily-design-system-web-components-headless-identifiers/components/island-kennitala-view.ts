// IslandKennitalaView component
//
// A headless read-only display of Iceland's Kennitala.
// Format: 10 digits where the first 6 are the date of birth (DDMMYY).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/island-kennitala-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Kennitala

import { IdentifierView } from "../lib/identifier-view.js";

export class IslandKennitalaView extends IdentifierView {
    protected readonly baseClass = "island-kennitala-view";
}
