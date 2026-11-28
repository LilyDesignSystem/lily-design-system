// EireIndividualHealthIdentifierView component
//
// A headless read-only display of Eire's Individual Health Identifier (IHI), a unique national healthcare identifier.
// Format: 10 digits (pattern [0-9]{10}).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/eire-individual-health-identifier-view/index.md (canonical contract)

import { IdentifierView } from "../lib/identifier-view.js";

export class EireIndividualHealthIdentifierView extends IdentifierView {
    protected readonly baseClass = "eire-individual-health-identifier-view";
}
