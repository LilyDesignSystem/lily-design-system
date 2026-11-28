// CymruRhifYGwasanaethIechydGwladolView component
//
// A headless read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol
// (Rhif GIG).
// Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with
//   England and the Isle of Man).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/cymru-rhif-y-gwasanaeth-iechyd-gwladol-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/NHS_number

import { IdentifierView } from "../lib/identifier-view.js";

export class CymruRhifYGwasanaethIechydGwladolView extends IdentifierView {
    protected readonly baseClass = "cymru-rhif-y-gwasanaeth-iechyd-gwladol-view";
}
