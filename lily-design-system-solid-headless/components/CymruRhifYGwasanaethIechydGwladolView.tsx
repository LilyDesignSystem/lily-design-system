// CymruRhifYGwasanaethIechydGwladolView component
//
// A headless display component for showing Wales's
// Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CymruRhifYGwasanaethIechydGwladolView label="National Health Service Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/NHS_number

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CymruRhifYGwasanaethIechydGwladolViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function CymruRhifYGwasanaethIechydGwladolView(
    props: CymruRhifYGwasanaethIechydGwladolViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`cymru-rhif-y-gwasanaeth-iechyd-gwladol-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
