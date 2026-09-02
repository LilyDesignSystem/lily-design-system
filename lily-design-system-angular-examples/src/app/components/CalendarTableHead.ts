import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableHead — a calendar table interactive grid thead for managing dates, days, etc. <thead>
 *
 * Headless Angular component. Attribute selector on the native `<thead>` —
 * the consumer writes `<thead lily-calendar-table-head>`, so the host element IS the
 * `<thead>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `calendar-table-head` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "thead[lily-calendar-table-head]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"calendar-table-head " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableHead {
  readonly className = input<string>("");
}
