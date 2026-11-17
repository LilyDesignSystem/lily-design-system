// StatusLight component
//
// A small colored dot status indicator paired with a status label.
// Inspired by Adobe Spectrum.
//
// Props:
//   class     — string, optional. CSS class name.
//   variant       — "neutral" | "informative" | "positive" | "notice"
//                  | "negative" | "active" | "inactive", default "neutral".
//                  Exposed via data-variant.
//   label         — string, REQUIRED. The status text (e.g., "Active", "Offline").
//   ...restProps  — additional HTML attributes spread onto the root <span>.
//
// Behavior:
//   Renders <span role="status" data-variant={variant}> containing
//   <span class="status-light-dot" aria-hidden="true"></span> and
//   <span class="status-light-label">{label}</span>.
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum StatusLight: https://spectrum.adobe.com/page/status-light/

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export type StatusLightVariant =
    "neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive";

export interface StatusLightProps {
    class?: string;
    /** Status variant; rendered as data-variant */
    variant?: StatusLightVariant;
    /** The status text (required) */
    label: string;
    [key: string]: unknown;
}

export default function StatusLight(props: StatusLightProps) {
    const p = withDefaults({ class: "" as const, variant: "neutral" as const }, props);
    const restProps = omit(p, "class", "variant", "label");
    return (
        <span
            class={`status-light ${p.class}`}
            role="status"
            data-variant={attr(p.variant)}
            {...restProps}
        >
            <span
                class="status-light-dot"
                aria-hidden="true"
            ></span>
            <span class="status-light-label">{p.label}</span>
        </span>
    );
}
