// NihonKojinBangoView component
//
// A headless read-only display of Japan's Individual Number / My Number (マイナンバー).
// Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check
// digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for
// positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder
// subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/nihon-kojin-bango-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Individual_Number

import { IdentifierView } from "../lib/identifier-view.js";

export class NihonKojinBangoView extends IdentifierView {
    protected readonly baseClass = "nihon-kojin-bango-view";
}
