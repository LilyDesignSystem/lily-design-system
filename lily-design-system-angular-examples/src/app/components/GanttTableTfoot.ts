import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTfoot — a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table-tfoot` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-gantt-table-tfoot",
  standalone: true,
  template: `<tfoot class="gantt-table-tfoot {{ className() }}"><ng-content /></tfoot>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTfoot {
  readonly className = input<string>("");
}
