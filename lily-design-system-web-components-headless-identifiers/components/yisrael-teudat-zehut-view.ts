// YisraelTeudatZehutView component
//
// A headless read-only display of Israel's Teudat Zehut (תעודת זהות).
// Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10)
// check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over
// 9 has its own two digits summed, and the total must be a multiple of 10.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/yisrael-teudat-zehut-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Israeli_identity_card

import { IdentifierView } from "../lib/identifier-view.js";

export class YisraelTeudatZehutView extends IdentifierView {
    protected readonly baseClass = "yisrael-teudat-zehut-view";
}
