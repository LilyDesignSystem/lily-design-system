import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTfoot — a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
 *
 * Headless Angular component. Attribute selector on the native `<tfoot>` —
 * the consumer writes `<tfoot lily-gantt-table-tfoot>`, so the host element IS the
 * `<tfoot>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `gantt-table-tfoot` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tfoot[lily-gantt-table-tfoot]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"gantt-table-tfoot " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTfoot {
  readonly className = input<string>("");
}
