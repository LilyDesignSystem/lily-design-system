// UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component
//
// A headless read-only display of Ukraine's Реєстраційний номер облікової картки платника податків (РНОКПП).
// Format: Ten digits: days since 1 Jan 1900 (birth), sequence number, check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_identification_number#Ukraine

import { IdentifierView } from "../lib/identifier-view.js";

export class UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView extends IdentifierView {
    protected readonly baseClass =
        "ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view";
}
