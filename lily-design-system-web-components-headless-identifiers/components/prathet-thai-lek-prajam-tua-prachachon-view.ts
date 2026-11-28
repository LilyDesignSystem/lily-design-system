// PrathetThaiLekPrajamTuaPrachachonView component
//
// A headless read-only display of Thailand's เลขประจำตัวประชาชน (National ID).
// Format: Thirteen digits: category, office, serial, Modulus-11 check digit, disambiguators.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/prathet-thai-lek-prajam-tua-prachachon-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Thailand

import { IdentifierView } from "../lib/identifier-view.js";

export class PrathetThaiLekPrajamTuaPrachachonView extends IdentifierView {
    protected readonly baseClass = "prathet-thai-lek-prajam-tua-prachachon-view";
}
