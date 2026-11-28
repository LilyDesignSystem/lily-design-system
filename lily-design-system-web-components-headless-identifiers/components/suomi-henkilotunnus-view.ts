// SuomiHenkilotunnusView component
//
// A headless read-only display of Finland's Henkilötunnus (HETU).
// Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/suomi-henkilotunnus-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)

import { IdentifierView } from "../lib/identifier-view.js";

export class SuomiHenkilotunnusView extends IdentifierView {
    protected readonly baseClass = "suomi-henkilotunnus-view";
}
