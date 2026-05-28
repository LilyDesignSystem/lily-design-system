import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTbody — a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table-tbody` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-gantt-table-tbody",
  standalone: true,
  template: `<tbody class="gantt-table-tbody {{ className() }}"><ng-content /></tbody>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTbody {
  readonly className = input<string>("");
}
