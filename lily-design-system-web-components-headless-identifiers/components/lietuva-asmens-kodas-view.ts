// LietuvaAsmensKodasView component
//
// A headless read-only display of Lithuania's Asmens kodas.
// Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/lietuva-asmens-kodas-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Lithuania

import { IdentifierView } from "../lib/identifier-view.js";

export class LietuvaAsmensKodasView extends IdentifierView {
    protected readonly baseClass = "lietuva-asmens-kodas-view";
}
