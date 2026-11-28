// RepublicaDominicanaCedulaDeIdentidadYElectoralView component
//
// A headless read-only display of the Dominican Republic's Cédula de Identidad y Electoral.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/republica-dominicana-cedula-de-identidad-y-electoral-view/index.md (canonical contract)
//   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

import { IdentifierView } from "../lib/identifier-view.js";

export class RepublicaDominicanaCedulaDeIdentidadYElectoralView extends IdentifierView {
    protected readonly baseClass = "republica-dominicana-cedula-de-identidad-y-electoral-view";
}
