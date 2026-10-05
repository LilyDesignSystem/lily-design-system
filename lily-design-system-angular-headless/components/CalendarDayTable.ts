import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarDayTable — a calendar grid for the time slots of one day: one row per slot. <table role="grid">
 *
 * Headless Angular component; a structural wrapper like CalendarTable. The
 * consumer supplies head, body and rows by reusing the CalendarTable*
 * sub-elements. Locale formatting (Intl) and cell content are the consumer's.
 *
 * Inputs: label (required accessible name, e.g. "Monday 6 January 2025"), caption (optional
 * visible caption), className.
 * Keyboard: none built in; the consumer implements grid navigation.
 * Deviation from Svelte: Angular cannot spread rest props onto an inner
 * element, so extra attributes land on the `lily-calendar-day-table` host.
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
