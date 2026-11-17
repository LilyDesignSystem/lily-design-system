// KanbanTableFoot component
//
// The footer section of a KanbanTable, rendered as a <tfoot> element.
// Contains KanbanTableRow elements with summary or aggregate data cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. KanbanTableRow elements with footer cells.
//   ...restProps — additional HTML attributes spread onto the <tfoot>.
//
// Syntax:
//   <KanbanTableFoot>
//     <KanbanTableRow>
//       <KanbanTableTD>Total: 3</KanbanTableTD>
//       <KanbanTableTD>Total: 5</KanbanTableTD>
//     </KanbanTableRow>
//   </KanbanTableFoot>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the KanbanTable grid level.
//
// Accessibility:
//   - <tfoot> provides structural footer semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a KanbanTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface KanbanTableFootProps {
    class?: string;
    /** KanbanTableRow elements with footer cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function KanbanTableFoot(props: KanbanTableFootProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tfoot
            class={`kanban-table-foot ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tfoot>
    );
}
