// VietNamCanCuocCongDanView component
//
// A headless display component for showing Viet Nam's
// Citizen Identification Number (CCCD) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <VietNamCanCuocCongDanView label="Citizen Identification Number (CCCD)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Vietnamese_identity_card

import { merge, omit } from "solid-js";
export interface VietNamCanCuocCongDanViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function VietNamCanCuocCongDanView(props: VietNamCanCuocCongDanViewProps) {
    const p = merge({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`viet-nam-can-cuoc-cong-dan-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
