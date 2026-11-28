// ZhongguoJuminShenfenzhengHaomaView component
//
// A headless read-only display of China's Resident Identity Card Number (居民身份证号码).
// Format: Eighteen characters (GB 11643): region, date of birth, sequence with sex parity, then an ISO 7064 MOD 11-2 check character (may be X).
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/zhongguo-jumin-shenfenzheng-haoma-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Resident_Identity_Card

import { IdentifierView } from "../lib/identifier-view.js";

export class ZhongguoJuminShenfenzhengHaomaView extends IdentifierView {
    protected readonly baseClass = "zhongguo-jumin-shenfenzheng-haoma-view";
}
