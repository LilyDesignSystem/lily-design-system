import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableRow — a kanban board table interactive grid row for organizing items by status <tr>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table-row` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table-row",
  standalone: true,
  template: `<tr class="kanban-table-row {{ className() }}"><ng-content /></tr>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableRow {
  readonly className = input<string>("");
}
