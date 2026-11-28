// TuaisceartEireannHealthAndCareNumberView component
//
// A headless read-only display of Tuaisceart Éireann (Northern Ireland)'s Health and Care (H&C) Number, a unique national healthcare identifier.
// Format: pattern XXX XXX XXXX ([0-9]{3} [0-9]{3} [0-9]{4}).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/tuaisceart-eireann-health-and-care-number-view/index.md (canonical contract)

import { IdentifierView } from "../lib/identifier-view.js";

export class TuaisceartEireannHealthAndCareNumberView extends IdentifierView {
    protected readonly baseClass = "tuaisceart-eireann-health-and-care-number-view";
}
