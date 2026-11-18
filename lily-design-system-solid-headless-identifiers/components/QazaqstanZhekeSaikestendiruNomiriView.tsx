// QazaqstanZhekeSaikestendiruNomiriView component
//
// A headless display component for showing Kazakhstan's
// Individual Identification Number (IIN) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <QazaqstanZhekeSaikestendiruNomiriView label="Individual Identification Number (IIN)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface QazaqstanZhekeSaikestendiruNomiriViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function QazaqstanZhekeSaikestendiruNomiriView(
    props: QazaqstanZhekeSaikestendiruNomiriViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`qazaqstan-zheke-saikestendiru-nomiri-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
