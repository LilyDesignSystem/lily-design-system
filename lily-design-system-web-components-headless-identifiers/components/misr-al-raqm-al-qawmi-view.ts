// MisrAlRaqmAlQawmiView component
//
// A headless read-only display of Egypt's الرقم القومي (National Number).
// Format: Fourteen digits: century, date of birth, governorate, serial (sex parity), check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/misr-al-raqm-al-qawmi-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Egypt

import { IdentifierView } from "../lib/identifier-view.js";

export class MisrAlRaqmAlQawmiView extends IdentifierView {
    protected readonly baseClass = "misr-al-raqm-al-qawmi-view";
}
