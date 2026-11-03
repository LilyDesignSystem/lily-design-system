import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarDayTable component
 *
 * A calendar grid for a grid of the time slots of one day: one row per slot. A structural wrapper like CalendarTable:
 * a <table> with role="grid" and data-view="day"; the consumer supplies the
 * head, body and rows by reusing the CalendarTable* sub-elements.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name describing the period shown, e.g. a day (e.g. "Monday 6 January 2025").
 *   caption — string, optional. Visible caption text displayed above the table.
 *   <ng-content /> — projected content, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-calendar-day-table label="Monday 6 January 2025">
 *     <tbody[lily-calendar-table-body]>...</tbody[lily-calendar-table-body]>
 *   </lily-calendar-day-table>
 *
 * Keyboard:
 *   None built-in — consumer implements grid keyboard navigation
 *   (arrow keys for cell movement, Enter/Space for selection).
 *
 * Accessibility:
 *   - role="grid" identifies the table as an interactive grid widget
 *   - aria-label provides an accessible name describing the period
 *   - data-view="day" lets consumer CSS and JS key on the view
 *
 * Internationalization:
 *   - label and caption supply all text; locale formatting (Intl) and cell
 *     content are the consumer's concern
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Reuse the CalendarTable* sub-elements; there are no CalendarDayTable* sub-elements
 *
 * References:
 *   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
@Component({
    selector: "lily-calendar-day-table",
    standalone: true,
    template: `<table class="calendar-day-table {{ className() }}" role="grid" [attr.aria-label]="label()" data-view="day">@if (caption()) {<caption>{{ caption() }}</caption>}<ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayTable {
    /** Accessible name describing the period shown. */
    readonly label = input.required<string>();
    /** Visible caption for the table. */
    readonly caption = input<string | undefined>(undefined);
    readonly className = input<string>("");
}
