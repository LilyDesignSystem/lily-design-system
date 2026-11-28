// QazaqstanZhekeSaikestendiruNomiriView component
//
// A headless read-only display of Kazakhstan's Individual Identification Number (IIN).
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/qazaqstan-zheke-saikestendiru-nomiri-view/index.md (canonical contract)
//   - https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf

import { IdentifierView } from "../lib/identifier-view.js";

export class QazaqstanZhekeSaikestendiruNomiriView extends IdentifierView {
    protected readonly baseClass = "qazaqstan-zheke-saikestendiru-nomiri-view";
}
