import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableTH — a kanban board table interactive grid header cell for organizing items by status <th>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table-th` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table-th",
  standalone: true,
  template: `<th class="kanban-table-th {{ className() }}" [attr.scope]="scope() || null"><ng-content /></th>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableTH {
  readonly scope = input<string>("");
  readonly className = input<string>("");
}
