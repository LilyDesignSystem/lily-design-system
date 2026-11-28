// ArgentinaCodigoUnicoDeIdentificacionLaboralView component
//
// A headless read-only display of Argentina's Código Único de Identificación Laboral (CUIL).
// Format: XX-NNNNNNNN-X: prefix, 8-digit DNI, Modulus-11 check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/argentina-codigo-unico-de-identificacion-laboral-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/CUIT

import { IdentifierView } from "../lib/identifier-view.js";

export class ArgentinaCodigoUnicoDeIdentificacionLaboralView extends IdentifierView {
    protected readonly baseClass = "argentina-codigo-unico-de-identificacion-laboral-view";
}
