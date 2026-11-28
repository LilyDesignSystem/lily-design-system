// AsSaudiyahRaqmAlHuwiyahAlWataniyahView component
//
// A headless read-only display of Saudi Arabia's National Identification Number.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/as-saudiyah-raqm-al-huwiyah-al-wataniyah-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Saudi Arabia

import { IdentifierView } from "../lib/identifier-view.js";

export class AsSaudiyahRaqmAlHuwiyahAlWataniyahView extends IdentifierView {
    protected readonly baseClass = "as-saudiyah-raqm-al-huwiyah-al-wataniyah-view";
}
