// ItaliaCodiceFiscaleView component
//
// A headless read-only display of Italy's Codice fiscale (CF).
// Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/italia-codice-fiscale-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Italian_fiscal_code

import { IdentifierView } from "../lib/identifier-view.js";

export class ItaliaCodiceFiscaleView extends IdentifierView {
    protected readonly baseClass = "italia-codice-fiscale-view";
}
