// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView component
//
// A headless read-only display of Uzbekistan's Personal identification number (JShShIR / PINFL).
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view/index.md (canonical contract)
//   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

import { IdentifierView } from "../lib/identifier-view.js";

export class OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView extends IdentifierView {
    protected readonly baseClass =
        "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view";
}
