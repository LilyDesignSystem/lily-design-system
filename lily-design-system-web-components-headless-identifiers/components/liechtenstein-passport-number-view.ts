// LiechtensteinPassportNumberView component
//
// A headless read-only display of Liechtenstein's passport number.
// Format: 1 letter followed by 5 digits (e.g. R00536).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/liechtenstein-passport-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Liechtenstein_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class LiechtensteinPassportNumberView extends IdentifierView {
    protected readonly baseClass = "liechtenstein-passport-number-view";
}
