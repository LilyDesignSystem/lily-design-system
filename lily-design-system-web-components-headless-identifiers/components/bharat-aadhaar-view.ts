// BharatAadhaarView component
//
// A headless read-only display of India's Aadhaar (आधार).
// Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit
// computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every
// adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/bharat-aadhaar-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Aadhaar

import { IdentifierView } from "../lib/identifier-view.js";

export class BharatAadhaarView extends IdentifierView {
    protected readonly baseClass = "bharat-aadhaar-view";
}
