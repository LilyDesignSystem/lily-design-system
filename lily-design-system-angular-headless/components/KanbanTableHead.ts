import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableHead — a kanban board table interactive grid thead for organizing items by status <thead>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table-head` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table-head",
  standalone: true,
  template: `<thead class="kanban-table-head {{ className() }}"><ng-content /></thead>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableHead {
  readonly className = input<string>("");
}
