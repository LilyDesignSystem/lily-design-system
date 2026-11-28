// NorgeFodselsnummerView component
//
// A headless read-only display of Norway's Fødselsnummer.
// Format: 11 digits where the first 6 represent the date of birth (DDMMYY).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/norge-fodselsnummer-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Norway

import { IdentifierView } from "../lib/identifier-view.js";

export class NorgeFodselsnummerView extends IdentifierView {
    protected readonly baseClass = "norge-fodselsnummer-view";
}
