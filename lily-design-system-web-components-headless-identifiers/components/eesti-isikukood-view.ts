// EestiIsikukoodView component
//
// A headless read-only display of Estonia's Isikukood (IK).
// Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even
//   female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes
//   persons born the same day, C is a checksum.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/eesti-isikukood-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Estonia

import { IdentifierView } from "../lib/identifier-view.js";

export class EestiIsikukoodView extends IdentifierView {
    protected readonly baseClass = "eesti-isikukood-view";
}
