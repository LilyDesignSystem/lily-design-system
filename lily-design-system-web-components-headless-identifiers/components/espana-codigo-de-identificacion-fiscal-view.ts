// EspanaCodigoDeIdentificacionFiscalView component
//
// A headless read-only display of Spain's Código de Identificación Fiscal (CIF).
// Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and
//   U are not used).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/espana-codigo-de-identificacion-fiscal-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

import { IdentifierView } from "../lib/identifier-view.js";

export class EspanaCodigoDeIdentificacionFiscalView extends IdentifierView {
    protected readonly baseClass = "espana-codigo-de-identificacion-fiscal-view";
}
