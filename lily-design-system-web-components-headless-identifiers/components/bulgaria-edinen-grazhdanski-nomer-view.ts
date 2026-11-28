// BulgariaEdinenGrazhdanskiNomerView component
//
// A headless read-only display of Bulgaria's Единен граждански номер /
// Edinen grazhdanski nomer (EGN).
// Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3
//   encode area and birth order (ninth digit even for boy, odd for girl),
//   and the tenth is a check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/bulgaria-edinen-grazhdanski-nomer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_citizenship_number

import { IdentifierView } from "../lib/identifier-view.js";

export class BulgariaEdinenGrazhdanskiNomerView extends IdentifierView {
    protected readonly baseClass = "bulgaria-edinen-grazhdanski-nomer-view";
}
