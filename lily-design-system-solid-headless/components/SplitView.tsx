// SplitView component
//
// A two-panel resizable layout container with a draggable divider between
// them. Inspired by Adobe Spectrum.
//
// Props:
//   class     — string, optional. CSS class name.
//   label         — string, REQUIRED. aria-label for the container.
//   orientation   — "horizontal" | "vertical", default "horizontal".
//   primary       — ReactNode, REQUIRED. First panel content.
//   secondary     — ReactNode, REQUIRED. Second panel content.
//   divider       — ReactNode, optional. Custom divider content.
//   splitPercent  — number 0-100, default 50. Initial split position as percentage.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders sections for primary and secondary content
//   - When `divider` is not provided, renders a default <div role="separator"
//     aria-orientation aria-valuenow aria-valuemin aria-valuemax tabIndex={0}>
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum SplitView: https://spectrum.adobe.com/page/split-view/

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { attachSplitView } from "./widget-keys";

export interface SplitViewProps {
    class?: string;
    /** aria-label for the container (required) */
    label: string;
    /** Orientation of the divider */
    orientation?: "horizontal" | "vertical";
    /** First panel content (required) */
    primary: JSX.Element;
    /** Second panel content (required) */
    secondary: JSX.Element;
    /** Custom divider content */
    divider?: JSX.Element;
    /** Initial split position as percentage (0-100) */
    splitPercent?: number;
    /** Called with each new position. */
    onSplitChange?: (value: number) => void;
    [key: string]: unknown;
}

export default function SplitView(props: SplitViewProps) {
    const p = withDefaults(
        { class: "" as const, orientation: "horizontal" as const, splitPercent: 50 },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "orientation",
        "primary",
        "secondary",
        "divider",
        "splitPercent",
        "onSplitChange",
    );
    const root: { current: HTMLDivElement | null } = { current: null };
    // The latest props, read live: a Solid component body runs once.
    const latest = {
        get current() {
            return p.onSplitChange;
        },
    };
    onSettled(() =>
        untrack(() =>
            attachSplitView(root.current!, { onChange: (next) => latest.current?.(next) }),
        ),
    );

    return (
        <div
            ref={(el) => (root.current = el)}
            class={`split-view ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            data-orientation={attr(p.orientation)}
            data-split-percent={attr(p.splitPercent)}
            {...restProps}
        >
            <section class="split-view-primary">{p.primary}</section>
            {p.divider !== undefined ? (
                p.divider
            ) : (
                <div
                    class="split-view-divider"
                    role="separator"
                    aria-orientation={attr(p.orientation)}
                    aria-valuenow={attr(p.splitPercent)}
                    aria-valuemin={attr(0)}
                    aria-valuemax={attr(100)}
                    tabindex={0}
                />
            )}
            <section class="split-view-secondary">{p.secondary}</section>
        </div>
    );
}
