// AlbaCommunityHealthIndexView component
//
// A headless read-only display of Scotland's Community Health Index (CHI).
// Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex
//   digit (odd male, even female) + a Modulus-11 check digit.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/alba-community-health-index-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

import { IdentifierView } from "../lib/identifier-view.js";

export class AlbaCommunityHealthIndexView extends IdentifierView {
    protected readonly baseClass = "alba-community-health-index-view";
}
