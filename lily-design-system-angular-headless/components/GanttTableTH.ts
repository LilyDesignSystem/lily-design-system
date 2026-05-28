import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTH — a Gantt chart table interactive grid header cell for planning schedule visualization <th>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table-th` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-gantt-table-th",
  standalone: true,
  template: `<th class="gantt-table-th {{ className() }}" [attr.scope]="scope() || null"><ng-content /></th>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTH {
  readonly scope = input<string>("");
  readonly className = input<string>("");
}
