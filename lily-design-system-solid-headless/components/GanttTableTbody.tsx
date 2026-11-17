// GanttTableTbody component
//
// The body section of a GanttTable, rendered as a <tbody> element.
// Contains GanttTableTr elements with task data cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. GanttTableTr elements with data cells.
//   ...restProps — additional HTML attributes spread onto the <tbody>.
//
// Syntax:
//   <GanttTableBody>
//     <GanttTableTr>
//       <GanttTableTD>Design</GanttTableTD>
//       <GanttTableTD>Jan 1</GanttTableTD>
//     </GanttTableTr>
//   </GanttTableBody>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the GanttTable grid level.
//
// Accessibility:
//   - <tbody> provides structural body semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a GanttTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface GanttTableTbodyProps {
    class?: string;
    /** GanttTableTr elements with task data cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GanttTableBody(props: GanttTableTbodyProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tbody
            class={`gantt-table-tbody ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tbody>
    );
}
