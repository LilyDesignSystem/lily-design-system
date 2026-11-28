// CostaRicaCedulaDeIdentidadView component
//
// A headless read-only display of Costa Rica's Cédula de Identidad.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/costa-rica-cedula-de-identidad-view/index.md (canonical contract)
//   - https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)

import { IdentifierView } from "../lib/identifier-view.js";

export class CostaRicaCedulaDeIdentidadView extends IdentifierView {
    protected readonly baseClass = "costa-rica-cedula-de-identidad-view";
}
