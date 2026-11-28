// EspanaTarjetaSanitariaIndividualView component
//
// A headless read-only display of an España Tarjeta Sanitaria Individual
// (TSI) unique national healthcare identifier, also known as CIP-SNS.
// Format: no fixed national format is standardised; the identifier is issued by
//   the consumer's regional health service.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/espana-tarjeta-sanitaria-individual-view/index.md (canonical contract)

import { IdentifierView } from "../lib/identifier-view.js";

export class EspanaTarjetaSanitariaIndividualView extends IdentifierView {
    protected readonly baseClass = "espana-tarjeta-sanitaria-individual-view";
}
