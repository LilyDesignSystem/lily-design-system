// CalendarTableFoot component
//
// The footer section of a CalendarTable, rendered as a <tfoot> element.
// Contains CalendarTableRow elements with summary or aggregate data cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. CalendarTableRow elements with footer cells.
//   ...restProps — additional HTML attributes spread onto the <tfoot>.
//
// Syntax:
//   <CalendarTableFoot>
//     <CalendarTableRow>
//       <CalendarTableTD>Week Total: 5</CalendarTableTD>
//     </CalendarTableRow>
//   </CalendarTableFoot>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the CalendarTable grid level.
//
// Accessibility:
//   - <tfoot> provides structural footer semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CalendarTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CalendarTableFootProps {
    class?: string;
    /** CalendarTableRow elements with footer cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CalendarTableFoot(props: CalendarTableFootProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tfoot
            class={`calendar-table-foot ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tfoot>
    );
}
