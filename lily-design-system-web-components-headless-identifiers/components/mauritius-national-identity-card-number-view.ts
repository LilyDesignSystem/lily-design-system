// MauritiusNationalIdentityCardNumberView component
//
// A headless read-only display of Mauritius's National Identity Card number.
// Format: 7-8 digits plus a Modulus-11 check character (0-9 or K).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/mauritius-national-identity-card-number-view/index.md (canonical contract)
//   - https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid

import { IdentifierView } from "../lib/identifier-view.js";

export class MauritiusNationalIdentityCardNumberView extends IdentifierView {
    protected readonly baseClass = "mauritius-national-identity-card-number-view";
}
