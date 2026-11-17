// PhaseBanner component
//
// A banner that states a service's phase (alpha or beta) and invites feedback. Renders a <div> with
// the `phase-banner` hook around the consumer's tag and text.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — JSX.Element, required. The phase tag and message.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <PhaseBanner label="…">…</PhaseBanner>
//
// Examples:
//   <PhaseBanner label="Service phase"><strong>Beta</strong> This is a new service.</PhaseBanner>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - A <div> has no role; pass role="region" or "group" through restProps so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - NHS UK design system: https://service-manual.nhs.uk/design-system

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface PhaseBannerProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function PhaseBanner(props: PhaseBannerProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`phase-banner ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
