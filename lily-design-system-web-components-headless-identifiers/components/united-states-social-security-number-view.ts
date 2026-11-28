// UnitedStatesSocialSecurityNumberView component
//
// A headless read-only display of a US Social Security number.
// Format: 9 digits grouped as XXX-XX-XXXX.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/united-states-social-security-number-view/index.md (canonical contract)
//   - https://www.ssa.gov/history/ssn/geocard.html

import { IdentifierView } from "../lib/identifier-view.js";

export class UnitedStatesSocialSecurityNumberView extends IdentifierView {
    protected readonly baseClass = "united-states-social-security-number-view";
}
