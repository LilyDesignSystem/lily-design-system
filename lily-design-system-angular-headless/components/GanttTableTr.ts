import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTr — a Gantt chart table interactive grid row for planning schedule visualization <tr>
 *
 * Headless Angular component. Attribute selector on the native `<tr>` —
 * the consumer writes `<tr lily-gantt-table-tr>`, so the host element IS the
 * `<tr>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `gantt-table-tr` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tr[lily-gantt-table-tr]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"gantt-table-tr " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTr {
  readonly className = input<string>("");
}
