// AustraliaIndividualHealthcareIdentifierView component
//
// A headless read-only display of Australia's Individual Healthcare Identifier (IHI).
// Format: 16 digits assigned by the Healthcare Identifiers Service.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/australia-individual-healthcare-identifier-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/My_Health_Record

import { IdentifierView } from "../lib/identifier-view.js";

export class AustraliaIndividualHealthcareIdentifierView extends IdentifierView {
    protected readonly baseClass = "australia-individual-healthcare-identifier-view";
}
