// ElladaDematerialisedSecuritiesSystemView component
//
// A headless read-only display of Greece's Dematerialised Securities System (DSS).
// Format: 10 digits linked to the investor's personal details (name, ID number,
//   passport number, tax registration number) and managed by the Central
//   Securities Depository of Greece.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/ellada-dematerialised-securities-system-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Central_Securities_Depository

import { IdentifierView } from "../lib/identifier-view.js";

export class ElladaDematerialisedSecuritiesSystemView extends IdentifierView {
    protected readonly baseClass = "ellada-dematerialised-securities-system-view";
}
