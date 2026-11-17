// StepListItem component
//
// One step in a step list. Status is exposed as `data-status`. When
// `current=true`, `data-current` is set so assistive tech announces
// the active step.
//
// Props:
//   class    — string, optional. CSS class name.
//   status       — "waiting" | "in-progress" | "finished" | "error", default "waiting".
//   current      — boolean, default false. When true, sets data-current.
//   label        — string, optional. aria-label override.
//   children     — ReactNode, optional. Step content (typically title + description).
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <StepListItem status="in-progress" current>
//     <strong>Profile</strong>
//     <span>Add your photo</span>
//   </StepListItem>
//
// Accessibility:
//   - data-current when current=true
//   - aria-label optional
//
// Internationalization:
//   - All user-facing strings are consumer-supplied via children/label
//
// Claude rules:
//   - Headless: no CSS, no styles
//
// References:
//   - Ant Design Steps: https://ant.design/components/steps
//   - aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export type StepListItemStatus = "waiting" | "in-progress" | "finished" | "error";

export interface StepListItemProps {
    class?: string;
    /** Step status */
    status?: StepListItemStatus;
    /** Whether this is the current step */
    current?: boolean;
    /** aria-label override */
    label?: string;
    /** Step content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function StepListItem(props: StepListItemProps) {
    const p = merge({ class: "" as const, status: "waiting" as const, current: false }, props);
    const restProps = omit(p, "class", "status", "current", "label", "children");
    return (
        <li
            class={`step-list-item ${p.class}`}
            data-status={attr(p.status)}
            data-current={attr(p.current ? "" : undefined)}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </li>
    );
}
