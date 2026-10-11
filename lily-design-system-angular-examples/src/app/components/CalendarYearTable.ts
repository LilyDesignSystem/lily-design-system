import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarYearTable — a calendar grid for the twelve months of one year (12 month cells). <table role="grid">
 *
 * Headless Angular component; a structural wrapper like CalendarTable. The
 * consumer supplies head, body and rows by reusing the CalendarTable*
 * sub-elements. Locale formatting (Intl) and cell content are the consumer's.
 *
 * Inputs: label (required accessible name, e.g. "2025"), caption (optional
 * visible caption), className.
 * Keyboard: none built in; the consumer implements grid navigation.
 * Deviation from Svelte: Angular cannot spread rest props onto an inner
 * element, so extra attributes land on the `lily-calendar-year-table` host.
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
