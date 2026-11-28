// PortugalNumeroDeIdentificacaoFiscalView component
//
// A headless read-only display of Portugal's Número de Identificação Fiscal (NIF).
// Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/portugal-numero-de-identificacao-fiscal-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

import { IdentifierView } from "../lib/identifier-view.js";

export class PortugalNumeroDeIdentificacaoFiscalView extends IdentifierView {
    protected readonly baseClass = "portugal-numero-de-identificacao-fiscal-view";
}
