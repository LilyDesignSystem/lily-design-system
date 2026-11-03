import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarYearTable component
 *
 * A calendar grid for a grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells). A structural wrapper like CalendarTable:
 * a <table> with role="grid" and data-view="year"; the consumer supplies the
 * head, body and rows by reusing the CalendarTable* sub-elements.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name describing the period shown, e.g. a year (e.g. "2025").
 *   caption — string, optional. Visible caption text displayed above the table.
 *   <ng-content /> — projected content, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-calendar-year-table label="2025">
 *     <tbody[lily-calendar-table-body]>...</tbody[lily-calendar-table-body]>
 *   </lily-calendar-year-table>
 *
 * Keyboard:
 *   None built-in — consumer implements grid keyboard navigation
 *   (arrow keys for cell movement, Enter/Space for selection).
 *
 * Accessibility:
 *   - role="grid" identifies the table as an interactive grid widget
 *   - aria-label provides an accessible name describing the period
 *   - data-view="year" lets consumer CSS and JS key on the view
 *
 * Internationalization:
 *   - label and caption supply all text; locale formatting (Intl) and cell
 *     content are the consumer's concern
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Reuse the CalendarTable* sub-elements; there are no CalendarYearTable* sub-elements
 *
 * References:
 *   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
@Component({
    selector: "lily-calendar-year-table",
    standalone: true,
    template: `<table class="calendar-year-table {{ className() }}" role="grid" [attr.aria-label]="label()" data-view="year">@if (caption()) {<caption>{{ caption() }}</caption>}<ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarYearTable {
    /** Accessible name describing the period shown. */
    readonly label = input.required<string>();
    /** Visible caption for the table. */
    readonly caption = input<string | undefined>(undefined);
    readonly className = input<string>("");
}
