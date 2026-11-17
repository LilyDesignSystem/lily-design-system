// CalendarRangePicker component
//
// A headless container for calendar-based date range selection. Renders a <div>
// with role="group" naming the controls the consumer
// puts inside it. Used in booking systems, travel planners, analytics dashboards,
// and reporting tools where users define start and end dates.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name describing the picker purpose.
//   children — ReactNode, required. Calendar grid content including date cells and navigation controls.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <CalendarRangePicker label="Select dates">
//
//   </CalendarRangePicker>
//
// Examples:
//
//   <CalendarRangePicker label="Select travel dates">
//     <CalendarTable label="January 2025">
//
//     </CalendarTable>
//   </CalendarRangePicker>
//
// Keyboard:
//   None built-in — the consumer should implement date cell navigation (arrow keys),
//   selection (Enter/Space), and range extension (Shift+click) as appropriate.
//
// Accessibility:
//   - role="group" groups the calendar controls under aria-label
//   - aria-label provides an accessible name for the calendar range picker
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//   - All date content and navigation is provided by the consumer
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer provides all selection logic, range highlighting, and navigation
//   - role="group" leaves screen reader reading keys working
//
// References:
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CalendarRangePickerProps {
    class?: string;
    label: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CalendarRangePicker(props: CalendarRangePickerProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`calendar-range-picker ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
