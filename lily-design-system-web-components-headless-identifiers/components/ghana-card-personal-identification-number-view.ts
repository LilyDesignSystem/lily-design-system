// GhanaCardPersonalIdentificationNumberView component
//
// A headless read-only display of Ghana's Ghana Card PIN.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/ghana-card-personal-identification-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Ghana_Card

import { IdentifierView } from "../lib/identifier-view.js";

export class GhanaCardPersonalIdentificationNumberView extends IdentifierView {
    protected readonly baseClass = "ghana-card-personal-identification-number-view";
}
