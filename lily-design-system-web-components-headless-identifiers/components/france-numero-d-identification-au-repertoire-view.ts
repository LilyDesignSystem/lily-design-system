// FranceNumeroDIdentificationAuRepertoireView component
//
// A headless read-only display of a France numéro d'identification au
// répertoire (NIR) unique national healthcare identifier.
// Format: 13 digits plus a 2-digit key, formatted X XX XX XX XXX XXX XX (sex,
//   birth year, birth month, department, commune, order number, key).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/france-numero-d-identification-au-repertoire-view/index.md (canonical contract)
//   - https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale

import { IdentifierView } from "../lib/identifier-view.js";

export class FranceNumeroDIdentificationAuRepertoireView extends IdentifierView {
    protected readonly baseClass = "france-numero-d-identification-au-repertoire-view";
}
