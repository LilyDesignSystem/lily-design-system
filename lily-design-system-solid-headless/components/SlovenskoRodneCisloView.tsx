// SlovenskoRodneCisloView component
//
// A headless display component for showing Slovakia's
// Rodné číslo (RČ) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <SlovenskoRodneCisloView label="Slovak Personal Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

import { merge, omit } from "solid-js";
export interface SlovenskoRodneCisloViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function SlovenskoRodneCisloView(props: SlovenskoRodneCisloViewProps) {
    const p = merge({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`slovensko-rodne-cislo-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
