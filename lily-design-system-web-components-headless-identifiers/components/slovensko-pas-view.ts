// SlovenskoPasView component
//
// A headless read-only display of Slovakia's Pas.
// Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/slovensko-pas-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Slovak_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class SlovenskoPasView extends IdentifierView {
    protected readonly baseClass = "slovensko-pas-view";
}
