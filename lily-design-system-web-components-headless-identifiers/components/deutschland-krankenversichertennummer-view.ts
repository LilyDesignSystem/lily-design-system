// DeutschlandKrankenversichertennummerView component
//
// A headless read-only display of Germany's Krankenversichertennummer (KVNR).
// Format: a random capital letter followed by eight random digits and a Luhn
//   check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/deutschland-krankenversichertennummer-view/index.md (canonical contract)
//   - https://de.wikipedia.org/wiki/Krankenversichertennummer

import { IdentifierView } from "../lib/identifier-view.js";

export class DeutschlandKrankenversichertennummerView extends IdentifierView {
    protected readonly baseClass = "deutschland-krankenversichertennummer-view";
}
