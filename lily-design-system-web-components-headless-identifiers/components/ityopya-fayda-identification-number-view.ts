// ItyopyaFaydaIdentificationNumberView component
//
// A headless read-only display of Ethiopia's Fayda Identification Number (FIN).
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/ityopya-fayda-identification-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Fayda_ID

import { IdentifierView } from "../lib/identifier-view.js";

export class ItyopyaFaydaIdentificationNumberView extends IdentifierView {
    protected readonly baseClass = "ityopya-fayda-identification-number-view";
}
