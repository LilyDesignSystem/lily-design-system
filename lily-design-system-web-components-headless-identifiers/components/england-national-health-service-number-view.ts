// EnglandNationalHealthServiceNumberView component
//
// A headless read-only display of England's National Health Service Number (NHS).
// Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated
//   through the Personal Demographics Service.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/england-national-health-service-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/NHS_number

import { IdentifierView } from "../lib/identifier-view.js";

export class EnglandNationalHealthServiceNumberView extends IdentifierView {
    protected readonly baseClass = "england-national-health-service-number-view";
}
