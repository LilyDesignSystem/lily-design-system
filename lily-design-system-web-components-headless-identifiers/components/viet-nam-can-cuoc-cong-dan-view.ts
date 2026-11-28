// VietNamCanCuocCongDanView component
//
// A headless read-only display of Viet Nam's Citizen Identification Number (CCCD).
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/viet-nam-can-cuoc-cong-dan-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Viet Nam

import { IdentifierView } from "../lib/identifier-view.js";

export class VietNamCanCuocCongDanView extends IdentifierView {
    protected readonly baseClass = "viet-nam-can-cuoc-cong-dan-view";
}
