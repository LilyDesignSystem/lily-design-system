// MaltaPassportNumberView component
//
// A headless read-only display of Malta's passport number.
// Format: 7 numerical digits issued by the Civil Registration Directorate.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/malta-passport-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Maltese_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class MaltaPassportNumberView extends IdentifierView {
    protected readonly baseClass = "malta-passport-number-view";
}
