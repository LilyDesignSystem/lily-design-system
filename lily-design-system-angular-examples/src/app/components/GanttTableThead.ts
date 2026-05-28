import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableThead — a Gantt chart table interactive grid thead for planning schedule visualization <thead>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table-thead` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-gantt-table-thead",
  standalone: true,
  template: `<thead class="gantt-table-thead {{ className() }}"><ng-content /></thead>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableThead {
  readonly className = input<string>("");
}
