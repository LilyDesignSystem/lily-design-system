// IndonesiaNomorIndukKependudukanView component
//
// A headless read-only display of Indonesia's Nomor Induk Kependudukan (NIK).
// Format: Sixteen digits: region, date of birth (+40 to day for females), serial. No check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/indonesia-nomor-induk-kependudukan-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Indonesia

import { IdentifierView } from "../lib/identifier-view.js";

export class IndonesiaNomorIndukKependudukanView extends IdentifierView {
    protected readonly baseClass = "indonesia-nomor-induk-kependudukan-view";
}
