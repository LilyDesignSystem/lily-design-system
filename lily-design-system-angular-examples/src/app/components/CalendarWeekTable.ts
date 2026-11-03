import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarWeekTable component
 *
 * A calendar grid for a grid of the seven days of one week as day columns. A structural wrapper like CalendarTable:
 * a <table> with role="grid" and data-view="week"; the consumer supplies the
 * head, body and rows by reusing the CalendarTable* sub-elements.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name describing the period shown, e.g. a week (e.g. "Week of 6 January 2025").
 *   caption — string, optional. Visible caption text displayed above the table.
 *   <ng-content /> — projected content, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-calendar-week-table label="Week of 6 January 2025">
 *     <tbody[lily-calendar-table-body]>...</tbody[lily-calendar-table-body]>
 *   </lily-calendar-week-table>
 *
 * Keyboard:
 *   None built-in — consumer implements grid keyboard navigation
 *   (arrow keys for cell movement, Enter/Space for selection).
 *
 * Accessibility:
 *   - role="grid" identifies the table as an interactive grid widget
 *   - aria-label provides an accessible name describing the period
 *   - data-view="week" lets consumer CSS and JS key on the view
 *
 * Internationalization:
 *   - label and caption supply all text; locale formatting (Intl) and cell
 *     content are the consumer's concern
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Reuse the CalendarTable* sub-elements; there are no CalendarWeekTable* sub-elements
 *
 * References:
 *   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
@Component({
    selector: "lily-calendar-week-table",
    standalone: true,
    template: `<table class="calendar-week-table {{ className() }}" role="grid" [attr.aria-label]="label()" data-view="week">@if (caption()) {<caption>{{ caption() }}</caption>}<ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekTable {
    /** Accessible name describing the period shown. */
    readonly label = input.required<string>();
    /** Visible caption for the table. */
    readonly caption = input<string | undefined>(undefined);
    readonly className = input<string>("");
}
