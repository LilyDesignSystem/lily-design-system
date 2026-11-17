// GanttTableThead component
//
// The header section of a GanttTable, rendered as a <thead> element.
// Contains GanttTableTr elements with column headers for task names,
// dates, durations, or other Gantt chart metadata.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. GanttTableTr elements with header cells.
//   ...restProps — additional HTML attributes spread onto the <thead>.
//
// Syntax:
//   <GanttTableHead>
//     <GanttTableTr><th>Task</th><th>Start</th><th>End</th></GanttTableTr>
//   </GanttTableHead>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the GanttTable grid level.
//
// Accessibility:
//   - <thead> provides structural header semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a GanttTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface GanttTableTheadProps {
    class?: string;
    /** GanttTableTr elements with header cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GanttTableHead(props: GanttTableTheadProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <thead
            class={`gantt-table-thead ${p.class}`}
            {...restProps}
        >
            {p.children}
        </thead>
    );
}
