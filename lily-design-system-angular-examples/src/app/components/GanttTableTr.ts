import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTr — a Gantt chart table interactive grid row for planning schedule visualization <tr>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table-tr` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-gantt-table-tr",
  standalone: true,
  template: `<tr class="gantt-table-tr {{ className() }}"><ng-content /></tr>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTr {
  readonly className = input<string>("");
}
