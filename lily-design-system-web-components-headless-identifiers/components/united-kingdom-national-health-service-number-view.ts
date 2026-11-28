// UnitedKingdomNationalHealthServiceNumberView component
//
// A headless read-only display of a UK NHS number.
// Format: 10 digits grouped as XXX XXX XXXX.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/united-kingdom-national-health-service-number-view/index.md (canonical contract)
//   - https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/

import { IdentifierView } from "../lib/identifier-view.js";

export class UnitedKingdomNationalHealthServiceNumberView extends IdentifierView {
    protected readonly baseClass = "united-kingdom-national-health-service-number-view";
}
