import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableRow — a calendar table interactive grid row for managing dates, days, etc. <tr>
 *
 * Headless Angular component. Attribute selector on the native `<tr>` —
 * the consumer writes `<tr lily-calendar-table-row>`, so the host element IS the
 * `<tr>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `calendar-table-row` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tr[lily-calendar-table-row]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"calendar-table-row " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableRow {
  readonly className = input<string>("");
}
