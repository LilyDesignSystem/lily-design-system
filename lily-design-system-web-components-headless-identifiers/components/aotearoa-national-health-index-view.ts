// AotearoaNationalHealthIndexView component
//
// A headless read-only display of New Zealand's National Health Index (NHI) Number.
// Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a
// Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from
// July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/aotearoa-national-health-index-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/NHI_Number

import { IdentifierView } from "../lib/identifier-view.js";

export class AotearoaNationalHealthIndexView extends IdentifierView {
    protected readonly baseClass = "aotearoa-national-health-index-view";
}
