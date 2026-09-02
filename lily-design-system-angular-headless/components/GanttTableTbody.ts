import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTableTbody — a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>
 *
 * Headless Angular component. Attribute selector on the native `<tbody>` —
 * the consumer writes `<tbody lily-gantt-table-tbody>`, so the host element IS the
 * `<tbody>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `gantt-table-tbody` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tbody[lily-gantt-table-tbody]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"gantt-table-tbody " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTableTbody {
  readonly className = input<string>("");
}
