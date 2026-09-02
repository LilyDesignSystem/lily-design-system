import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTD — a Gantt chart table interactive grid data cell for planning schedule visualization <td>
 *
 * Headless Angular component. Attribute selector on the native `<td>` —
 * the consumer writes `<td lily-gantt-table-td>`, so the host element IS the
 * `<td>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `gantt-table-td` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "td[lily-gantt-table-td]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"gantt-table-td " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTD {
  readonly className = input<string>("");
}
