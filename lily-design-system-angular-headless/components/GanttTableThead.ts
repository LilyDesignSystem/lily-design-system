import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableThead — a Gantt chart table interactive grid thead for planning schedule visualization <thead>
 *
 * Headless Angular component. Attribute selector on the native `<thead>` —
 * the consumer writes `<thead lily-gantt-table-thead>`, so the host element IS the
 * `<thead>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `gantt-table-thead` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "thead[lily-gantt-table-thead]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"gantt-table-thead " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableThead {
  readonly className = input<string>("");
}
