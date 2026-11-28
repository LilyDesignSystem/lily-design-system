// BrasilCartaoNacionalDeSaudeView component
//
// A headless read-only display of Brazil's Cartão Nacional de Saúde (CNS).
// Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN
// NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry);
// numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum
// Modulus-11 check across all 15 digits.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/brasil-cartao-nacional-de-saude-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/CPF_number

import { IdentifierView } from "../lib/identifier-view.js";

export class BrasilCartaoNacionalDeSaudeView extends IdentifierView {
    protected readonly baseClass = "brasil-cartao-nacional-de-saude-view";
}
