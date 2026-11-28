// MagyarorszagTajSzamView component
//
// A headless read-only display of Hungary's Társadalombiztosítási Azonosító Jel (TAJ).
// Format: Nine digits, SSS SSS SSK. The ninth digit is a check digit from alternating weights 3 and 7 over the first eight, Modulus 10.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/magyarorszag-taj-szam-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Hungary

import { IdentifierView } from "../lib/identifier-view.js";

export class MagyarorszagTajSzamView extends IdentifierView {
    protected readonly baseClass = "magyarorszag-taj-szam-view";
}
