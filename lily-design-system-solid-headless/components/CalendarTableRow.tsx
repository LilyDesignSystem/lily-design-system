// CalendarTableRow component
//
// A single row within a CalendarTable grid. Renders as a <tr>,
// containing CalendarTableTD cells for each day in the week.
// Used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. CalendarTableTD cells for each day in the row.
//   ...restProps — additional HTML attributes spread onto the <tr>.
//
// Syntax:
//   <CalendarTableRow>
//     <CalendarTableTD>1</CalendarTableTD>
//     <CalendarTableTD>2</CalendarTableTD>
//   </CalendarTableRow>
//
// Keyboard:
//   None built-in — keyboard navigation is handled at the CalendarTable grid level.
//
// Accessibility:
//   - <tr> has implicit role="row" within the grid (no explicit role needed)
//
// Internationalization:
//   - All cell content comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CalendarTable component (which provides the <table>)
//   - No internal state — purely a structural wrapper
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CalendarTableRowProps {
    class?: string;
    /** CalendarTableTD cells for this row. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CalendarTableRow(props: CalendarTableRowProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tr
            class={`calendar-table-row ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tr>
    );
}
