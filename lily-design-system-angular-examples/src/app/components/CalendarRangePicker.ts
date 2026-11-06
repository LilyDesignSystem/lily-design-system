import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarRangePicker component
 *
 * A headless container for calendar-based date range selection. Renders a <div>
 * with role="application" to support rich keyboard interactions beyond standard
 * navigation. Used in booking systems, travel planners, analytics dashboards,
 * and reporting tools where users define start and end dates.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name describing the picker purpose.
 *   <ng-content /> — projected content, required. Calendar grid content including date cells and navigation controls.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-calendar-range-picker label="Select dates">
 *     <!-- calendar grid -->
 *   </lily-calendar-range-picker>
 *
 * Examples:
 *   <!-- Travel date range picker -->
 *   <lily-calendar-range-picker label="Select travel dates">
 *     <lily-calendar-table label="January 2025">
 *       <!-- date cells with range highlighting -->
 *     </lily-calendar-table>
 *   </lily-calendar-range-picker>
 *
 * Keyboard:
 *   None built-in — the consumer should implement date cell navigation (arrow keys),
 *   selection (Enter/Space), and range extension (Shift+click) as appropriate.
 *
 * Accessibility:
 *   - role="application" indicates the widget manages its own keyboard interactions
 *   - aria-label provides an accessible name for the calendar range picker
 *
 * Internationalization:
 *   - Label text comes through the label prop; no hardcoded strings
 *   - All date content and navigation is provided by the consumer
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Consumer provides all selection logic, range highlighting, and navigation
 *   - role="application" overrides standard screen reader navigation
 *
 * References:
 *   - WAI-ARIA Application Role: https://www.w3.org/TR/wai-aria-1.2/#application
 *   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
@Component({
    selector: "lily-calendar-range-picker",
    standalone: true,
    template: `<div class="calendar-range-picker {{ className() }}" role="application" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarRangePicker {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
