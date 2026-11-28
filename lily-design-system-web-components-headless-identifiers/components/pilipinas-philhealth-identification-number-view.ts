// PilipinasPhilhealthIdentificationNumberView component
//
// A headless read-only display of the Philippines' PhilHealth Identification Number (PIN).
// Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth)
// to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit
// algorithm; correctness is confirmed against PhilHealth's own membership records.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/pilipinas-philhealth-identification-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/PhilHealth

import { IdentifierView } from "../lib/identifier-view.js";

export class PilipinasPhilhealthIdentificationNumberView extends IdentifierView {
    protected readonly baseClass = "pilipinas-philhealth-identification-number-view";
}
