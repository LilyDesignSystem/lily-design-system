// CanadaSocialInsuranceNumberView component
//
// A headless read-only display of Canada's Social Insurance Number (SIN).
// Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit
// denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9
// temporary residents), the following seven digits are a serial number, and the final digit is a
// Luhn (Modulus-10) check digit over the first eight.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/canada-social-insurance-number-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Social_Insurance_Number

import { IdentifierView } from "../lib/identifier-view.js";

export class CanadaSocialInsuranceNumberView extends IdentifierView {
    protected readonly baseClass = "canada-social-insurance-number-view";
}
