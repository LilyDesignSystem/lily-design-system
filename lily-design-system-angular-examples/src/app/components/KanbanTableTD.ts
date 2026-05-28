import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableTD — kanban board table interactive grid data cell for organizing items by status <td>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table-td` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table-td",
  standalone: true,
  template: `<td class="kanban-table-td {{ className() }}"><ng-content /></td>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableTD {
  readonly className = input<string>("");
}
