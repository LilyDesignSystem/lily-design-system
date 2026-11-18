// ElladaDematerialisedSecuritiesSystemView component
//
// A headless display component for showing Greece's
// Dematerialised Securities System (DSS) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ElladaDematerialisedSecuritiesSystemView label="Dematerialised Securities System" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Central_Securities_Depository

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ElladaDematerialisedSecuritiesSystemViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function ElladaDematerialisedSecuritiesSystemView(
    props: ElladaDematerialisedSecuritiesSystemViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`ellada-dematerialised-securities-system-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
