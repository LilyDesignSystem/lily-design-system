// LietuvaPasasView component
//
// A headless read-only display of Lithuania's Pasas (passport).
// Format: 8-digit passport or identity card number.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/lietuva-pasas-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Lithuanian_passport

import { IdentifierView } from "../lib/identifier-view.js";

export class LietuvaPasasView extends IdentifierView {
    protected readonly baseClass = "lietuva-pasas-view";
}
