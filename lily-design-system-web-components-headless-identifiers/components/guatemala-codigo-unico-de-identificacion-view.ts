// GuatemalaCodigoUnicoDeIdentificacionView component
//
// A headless read-only display of Guatemala's Código Único de Identificación (CUI).
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/guatemala-codigo-unico-de-identificacion-view/index.md (canonical contract)
//   - https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf

import { IdentifierView } from "../lib/identifier-view.js";

export class GuatemalaCodigoUnicoDeIdentificacionView extends IdentifierView {
    protected readonly baseClass = "guatemala-codigo-unico-de-identificacion-view";
}
