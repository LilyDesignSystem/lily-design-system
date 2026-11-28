// CeskoCestovniPasView component
//
// A headless read-only display of Czech Republic's Cestovní pas.
// Format: usually 8 digits, sometimes longer, issued by the Ministry of the
//   Interior.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/cesko-cestovni-pas-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Czech_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class CeskoCestovniPasView extends IdentifierView {
    protected readonly baseClass = "cesko-cestovni-pas-view";
}
