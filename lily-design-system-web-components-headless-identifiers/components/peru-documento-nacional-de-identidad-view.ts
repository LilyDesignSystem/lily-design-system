// PeruDocumentoNacionalDeIdentidadView component
//
// A headless read-only display of Peru's Documento Nacional de Identidad (DNI).
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/peru-documento-nacional-de-identidad-view/index.md (canonical contract)
//   - https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)

import { IdentifierView } from "../lib/identifier-view.js";

export class PeruDocumentoNacionalDeIdentidadView extends IdentifierView {
    protected readonly baseClass = "peru-documento-nacional-de-identidad-view";
}
