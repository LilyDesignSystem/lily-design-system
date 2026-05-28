import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTD — a Gantt chart table interactive grid data cell for planning schedule visualization <td>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table-td` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-gantt-table-td",
  standalone: true,
  template: `<td class="gantt-table-td {{ className() }}"><ng-content /></td>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTD {
  readonly className = input<string>("");
}
