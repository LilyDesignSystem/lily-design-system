import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableBody — a kanban board table interactive grid tbody for organizing items by status <tbody>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table-body` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table-body",
  standalone: true,
  template: `<tbody class="kanban-table-body {{ className() }}"><ng-content /></tbody>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableBody {
  readonly className = input<string>("");
}
