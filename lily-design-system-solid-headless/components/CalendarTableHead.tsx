// CalendarTableHead component
//
// The header section of a CalendarTable, rendered as a <thead> element.
// Contains CalendarTableRow elements with day-of-week column headers.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. CalendarTableRow elements with header cells.
//   ...restProps — additional HTML attributes spread onto the <thead>.
//
// Syntax:
//   <CalendarTableHead>
//     <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th></CalendarTableRow>
//   </CalendarTableHead>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the CalendarTable grid level.
//
// Accessibility:
//   - <thead> provides structural header semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CalendarTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CalendarTableHeadProps {
    class?: string;
    /** CalendarTableRow elements with day-of-week header cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CalendarTableHead(props: CalendarTableHeadProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <thead
            class={`calendar-table-head ${p.class}`}
            {...restProps}
        >
            {p.children}
        </thead>
    );
}
